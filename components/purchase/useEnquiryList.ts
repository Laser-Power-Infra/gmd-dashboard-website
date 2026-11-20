'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { startPurchase } from '@/app/purchase/actions';
import type { StockItem } from '@/app/purchase/catalog';
import { canPayOnline } from '@/lib/paymentLimit';
import { loadCheckout, openRazorpayCheckout } from '@/lib/razorpayCheckout';

/**
 * The enquiry list for /purchase: saved in localStorage under the same key the
 * old page used, so lists people already built carry over. Validated inline, sent either as
 * Buy now (Razorpay, under 20 lakh) or as a quote request.
 */

// Same limits as purchaseLinesSchema (lib/schemas/cost.ts).
export const MAX_QTY = 9999;
export const MAX_ITEMS = 50;
export const MAX_REMARKS = 500;
export const MAX_NOTES = 2000;
const STORAGE_KEY = 'gmd-enquiry-list';

export interface ListItem {
  key: string;
  itemCode: string;
  name: string;
  title: string;
  unit: string;
  image: string | null;
  size: string | null;
  pressure: string | null;
  quantity: string;
  remarks: string;
  /** Rupees, display only - the server re-prices. Missing on lists saved before prices. */
  unitPrice?: number | null;
}

/** Whole number from 1 to MAX_QTY; blank or junk becomes 1. */
export const clampQty = (value: string | number) =>
  String(Math.min(MAX_QTY, Math.max(1, Math.floor(Number(value)) || 1)));

/** Inline message while typing; null when valid. */
export const qtyError = (value: string) => {
  const n = Number(value);
  return value.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= MAX_QTY
    ? null
    : 'Enter a whole number from 1 to 9,999';
};

export type ListStep = 'list' | 'quote' | 'sent' | 'paid';

export function useEnquiryList() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [step, setStep] = useState<ListStep>('list');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState<'buy' | 'quote' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read after hydration so the server HTML (empty list) matches the first client render.
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved) && saved.length > 0) setItems(saved);
    } catch {
      // Private mode or corrupt data: start empty.
    }
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable: the list still works for this visit.
    }
  }, [items]);

  const find = (key: string) => items.find((i) => i.key === key);

  const add = (item: StockItem) => {
    if (find(item.key)) return;
    if (items.length >= MAX_ITEMS) {
      toast.error(`Your list can hold up to ${MAX_ITEMS} items.`);
      return;
    }
    setStep('list');
    setItems((prev) => [
      ...prev,
      {
        key: item.key,
        itemCode: item.itemCode,
        name: item.name,
        title: item.title,
        unit: item.unit,
        image: item.image,
        size: item.size,
        pressure: item.pressure,
        quantity: '1',
        remarks: '',
        unitPrice: item.unitPrice,
      },
    ]);
  };

  const update = (key: string, field: 'quantity' | 'remarks', value: string) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)));

  const remove = (key: string) =>
    setItems((prev) => {
      const next = prev.filter((i) => i.key !== key);
      if (next.length === 0) setStep('list');
      return next;
    });

  /** Stepper: +1 / -1, removing the line when it would drop below 1. */
  const step1 = (key: string, delta: 1 | -1) => {
    const item = find(key);
    if (!item) return;
    const next = Number(clampQty(item.quantity)) + delta;
    if (next < 1) remove(key);
    else update(key, 'quantity', clampQty(next));
  };

  const hasInvalidQty = items.some((i) => qtyError(i.quantity) !== null);
  const allPriced = items.length > 0 && items.every((i) => i.unitPrice != null && i.unitPrice > 0);
  const totalPaise = allPriced
    ? items.reduce((sum, i) => sum + Math.round(i.unitPrice! * 100) * Number(clampQty(i.quantity)), 0)
    : null;
  const buyable = canPayOnline(totalPaise);

  const lines = () =>
    items.map((i) => ({ itemCode: i.itemCode, itemName: i.name, quantity: Number(clampQty(i.quantity)), remarks: i.remarks }));

  const buyNow = async () => {
    setBusy('buy');
    setError(null);
    try {
      const payload = lines();
      const [order] = await Promise.all([startPurchase(payload), loadCheckout()]);
      if (!order.ok) throw new Error(order.message);
      const result = await openRazorpayCheckout(order, `Purchase of ${payload.length} item${payload.length === 1 ? '' : 's'}`);
      if (result.status === 'paid') {
        setItems([]);
        setStep('paid');
      } else if (result.status === 'failed') {
        setError(result.message);
      } else {
        toast.info('Payment not completed. You can pay later from Quotes and orders.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be started.');
    } finally {
      setBusy(null);
    }
  };

  const sendQuote = async () => {
    setBusy('quote');
    setError(null);
    try {
      const res = await fetch('/api/purchase-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notes, items: lines() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const fieldError = data.errors && Object.values(data.errors).flat()[0];
        throw new Error(String(fieldError || data.error || 'The request could not be sent.'));
      }
      setItems([]);
      setNotes('');
      setStep('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The request could not be sent.');
    } finally {
      setBusy(null);
    }
  };

  return {
    items,
    find,
    add,
    update,
    remove,
    step1,
    step,
    setStep,
    notes,
    setNotes,
    busy,
    error,
    hasInvalidQty,
    totalPaise,
    buyable,
    buyNow,
    sendQuote,
  };
}
