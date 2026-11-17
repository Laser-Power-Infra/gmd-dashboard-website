'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { FormEvent, PointerEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import DebouncedSearchInput from '@/components/technical/DebouncedSearchInput';
import { catalogQuery, type CatalogFilters, type StockItem } from '@/app/purchase/catalog';

interface CartItem {
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
}

const ENQUIRY_EMAIL = 'info@gmdalui.co.in';
const CART_STORAGE_KEY = 'gmd-enquiry-list';

/** Whole number >= 1, as a string for the input; blank or junk becomes 1. */
const clampQty = (value: string | number) => String(Math.max(1, Math.floor(Number(value)) || 1));


const TILT_MAX_DEG = 5;
const TILT_EASE = 0.075;
const GLIDE_EASE = 0.12;
const RETURN_EASE = 0.1;

interface TiltState {
  el: HTMLDivElement;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
  tmx: number;
  tmy: number;
  cmx: number;
  cmy: number;
  active: boolean;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useCardTilt() {
  const states = useRef(new WeakMap<HTMLDivElement, TiltState>());
  const live = useRef(new Set<TiltState>());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const startLoop = useCallback(() => {
    if (rafId.current !== null) return;

    const step = () => {
      live.current.forEach((s) => {
        const k = s.active ? TILT_EASE : RETURN_EASE;
        const g = s.active ? GLIDE_EASE : RETURN_EASE;

        s.cx += (s.tx - s.cx) * k;
        s.cy += (s.ty - s.cy) * k;
        s.cmx += (s.tmx - s.cmx) * g;
        s.cmy += (s.tmy - s.cmy) * g;

        s.el.style.setProperty('--ry', `${s.cx.toFixed(3)}deg`);
        s.el.style.setProperty('--rx', `${s.cy.toFixed(3)}deg`);
        s.el.style.setProperty('--mx', `${(s.cmx * 100).toFixed(2)}%`);
        s.el.style.setProperty('--my', `${(s.cmy * 100).toFixed(2)}%`);

        const settled =
          !s.active &&
          Math.abs(s.tx - s.cx) < 0.005 &&
          Math.abs(s.ty - s.cy) < 0.005 &&
          Math.abs(s.tmx - s.cmx) < 0.002 &&
          Math.abs(s.tmy - s.cmy) < 0.002;

        if (settled) {
          s.el.style.setProperty('--rx', '0deg');
          s.el.style.setProperty('--ry', '0deg');
          s.el.style.setProperty('--gloss', '0');
          s.el.classList.remove('is-tilting');
          live.current.delete(s);
        }
      });

      rafId.current = live.current.size > 0 ? requestAnimationFrame(step) : null;
    };

    rafId.current = requestAnimationFrame(step);
  }, []);

  const getState = useCallback((el: HTMLDivElement): TiltState => {
    const existing = states.current.get(el);
    if (existing) return existing;
    const created: TiltState = {
      el,
      tx: 0,
      ty: 0,
      cx: 0,
      cy: 0,
      tmx: 0.5,
      tmy: 0.5,
      cmx: 0.5,
      cmy: 0.5,
      active: false,
    };
    states.current.set(el, created);
    return created;
  }, []);

  const onPointerEnter = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch' || prefersReducedMotion()) return;
      const el = e.currentTarget;
      const s = getState(el);
      s.active = true;
      el.classList.add('is-tilting');
      el.style.setProperty('--gloss', '1');
      live.current.add(s);
      startLoop();
    },
    [getState, startLoop]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch' || prefersReducedMotion()) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = clamp01((e.clientX - rect.left) / rect.width);
      const py = clamp01((e.clientY - rect.top) / rect.height);

      const s = getState(el);
      s.tx = (px - 0.5) * 2 * TILT_MAX_DEG;
      s.ty = (0.5 - py) * 2 * TILT_MAX_DEG;
      s.tmx = px;
      s.tmy = py;

      live.current.add(s);
      startLoop();
    },
    [getState, startLoop]
  );

  const onPointerLeave = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return;
      const s = getState(e.currentTarget);
      s.active = false;
      s.tx = 0;
      s.ty = 0;
      s.tmx = 0.5;
      s.tmy = 0.5;
      live.current.add(s);
      startLoop();
    },
    [getState, startLoop]
  );

  return { onPointerMove, onPointerEnter, onPointerLeave };
}

/** Plain-text enquiry, used for the "email it yourself" fallback link. */
interface PurchaseProps {
  /** The current page of filtered items - filtering and paging happen on the server. */
  items: StockItem[];
  total: number;
  catalogSize: number;
  options: { types: string[]; sizes: string[]; pns: string[]; mocs: string[] };
  filters: CatalogFilters;
  pageCount: number;
  isSignedIn: boolean;
  authSlot?: ReactNode;
}

export default function Purchase({
  items: displayedItems,
  total,
  catalogSize,
  options,
  filters,
  pageCount,
  isSignedIn,
  authSlot,
}: PurchaseProps) {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'list' | 'form' | 'sent'>('list');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fabPulse, setFabPulse] = useState(0);
  const tilt = useCardTilt();

  const openCart = useCallback((step: 'list' | 'form' = 'list') => {
    setCartStep(step);
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setCartStep('list');
  }, []);

  // Escape closes the drawer
  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isCartOpen]);

  // Keep the enquiry list across reloads. Load once, then save on every change.
  const cartLoaded = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
      // Read after hydration, not in useState, so the server HTML (empty list) matches the first client render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved) && saved.length > 0) setCartItems(saved);
    } catch {
      // Private mode or corrupt data: start with an empty list.
    }
    cartLoaded.current = true;
  }, []);
  useEffect(() => {
    if (!cartLoaded.current) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage unavailable: the list still works for this visit.
    }
  }, [cartItems]);

  const searchTerm = filters.q;
  const activeFilters = [filters.type, filters.size, filters.pn, filters.moc].filter(Boolean).length;
  const page = filters.page;

  // Any filter change goes back to page 1 and lets the server render the new view.
  const setFilter = useCallback(
    (key: 'q' | 'type' | 'size' | 'pn' | 'moc', value: string) =>
      router.push(`/purchase${catalogQuery({ ...filters, [key]: value, page: 1 })}`, { scroll: false }),
    [router, filters]
  );
  const commitSearch = useCallback((val: string) => setFilter('q', val.trim()), [setFilter]);
  const resetFilters = () => router.push('/purchase', { scroll: false });

  const handleAddItem = (item: StockItem, andEnquire = false) => {
    setCartItems((prev) => {
      if (prev.some((i) => i.key === item.key)) return prev;
      return [
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
        },
      ];
    });
    setFabPulse((n) => n + 1);
    if (andEnquire) openCart('form');
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setIsCartOpen(false);
        setCartStep('list');
      }
      return next;
    });
  };

  const handleCartChange = (index: number, field: 'quantity' | 'remarks', value: string) => {
    setCartItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/purchase-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: notes,
          items: cartItems.map((i) => ({
            itemCode: i.itemCode,
            itemName: i.name,
            quantity: Number(clampQty(i.quantity)),
            remarks: i.remarks,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const fieldError = data.errors && Object.values(data.errors).flat()[0];
        throw new Error(fieldError || data.error || 'Could not send your enquiry.');
      }
      setCartStep('sent');
      setCartItems([]);
      setNotes('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not send your enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="purchase-page-wrapper">
      <div className="purchase-hero">
        <div className="container">
          <h1 className="purchase-hero-title">Ready Stock Catalogue</h1>
          <p className="purchase-hero-subtitle">
            Valves and spares available from our Howrah stock. Build a list and request a quotation &mdash;
            pricing is confirmed by our sales team against your requirement.
          </p>
          {authSlot && <div className="purchase-hero-auth">{authSlot}</div>}
        </div>
      </div>

      <div className="container">
        {/* Search & Filter Section */}
        <div className="purchase-search-section">
          {/* GET form: filtering still works with JS off; with JS, setFilter navigates instead. */}
          <form
            className="filter-controls-container"
            method="get"
            action="/purchase"
            role="search"
            onSubmit={(e) => {
              // Enter in the search box: commit now instead of a full page reload.
              e.preventDefault();
              commitSearch(String(new FormData(e.currentTarget).get('q') ?? ''));
            }}
          >
            <div className="search-box-container static-search">
              <i className="fas fa-search search-icon" aria-hidden="true"></i>
              <DebouncedSearchInput
                value={searchTerm}
                onCommit={commitSearch}
                placeholder="Search by item code or description (e.g. SLUICE VALVE 40MM)"
                className="purchase-search-input"
                name="q"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => commitSearch('')} aria-label="Clear search">
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              )}
            </div>

            <div className="purchase-filter-row">
              <label className="purchase-filter">
                <span>Type</span>
                <select name="type" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
                  <option value="">All types</option>
                  {options.types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>Size</span>
                <select name="size" value={filters.size} onChange={(e) => setFilter('size', e.target.value)}>
                  <option value="">All sizes</option>
                  {options.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>Pressure</span>
                <select name="pn" value={filters.pn} onChange={(e) => setFilter('pn', e.target.value)}>
                  <option value="">All ratings</option>
                  {options.pns.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>MOC</span>
                <select name="moc" value={filters.moc} onChange={(e) => setFilter('moc', e.target.value)}>
                  <option value="">All materials</option>
                  {options.mocs.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              {(activeFilters > 0 || searchTerm) && (
                <button type="button" className="purchase-filter-reset" onClick={resetFilters}>
                  <i className="fas fa-rotate-left" aria-hidden="true"></i> Reset
                </button>
              )}
              <noscript>
                <button type="submit" className="purchase-filter-reset">
                  Apply
                </button>
              </noscript>
            </div>
          </form>
        </div>

        {/* Catalog Grid */}
        <div className="catalog-section">
          <h2 className="section-heading">
            Available Items
            <span className="result-count">
              {total} of {catalogSize}
            </span>
          </h2>

          <div className="purchase-grid">
            {displayedItems.map((item) => (
              <div key={item.key} className="purchase-card catalog-card" {...tilt}>
                <span className="card-accent-bar" aria-hidden="true" />
                <span className="card-glare" aria-hidden="true" />

                <div className="purchase-media">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="purchase-media-img" loading="lazy" />
                  ) : (
                    <div className="purchase-media-placeholder" role="img" aria-label="No photo available">
                      <i className="fas fa-cubes" aria-hidden="true"></i>
                      <span>Photo on request</span>
                    </div>
                  )}

                  {item.size && (
                    <span className="size-badge-overlay">
                      <i className="fas fa-ruler-combined badge-icon" aria-hidden="true"></i>
                      {item.size}
                    </span>
                  )}

                  {item.pressure && (
                    <span className="pressure-badge-overlay">
                      <i className="fas fa-gauge-high badge-icon" aria-hidden="true"></i>
                      {item.pressure}
                    </span>
                  )}
                </div>

                <div className="purchase-body">
                  <div className="purchase-meta">
                    {/* "TRADING VALVES" is an internal ERP stock class, not meant for buyers. */}
                    {item.category !== 'TRADING VALVES' && (
                      <span className="item-cat-badge">{item.category}</span>
                    )}
                    {/* The source dump carries no quantity column - `item.qty` is only a
                        count of repeated rows, and that reading is contradicted by the
                        data (see catalog.ts), so no figure is published to buyers.
                        shortcut: ready-stock tag with no number, which is the acceptance
                        criterion's own alternative; restore `· {item.qty} {item.unit}`
                        once Puja confirms how to read stock quantities. */}
                    <span className="stock-badge">
                      <i className="fas fa-circle-check" aria-hidden="true"></i>
                      Ready stock
                    </span>
                  </div>

                  <h3 className="item-title">{item.title}</h3>
                  {/* One source row carries a leaked Excel "#N/A" instead of a code. */}
                  {/^[A-Z0-9]{3,}$/i.test(item.itemCode) && (
                    <p className="item-code-line">Code {item.itemCode}</p>
                  )}

                  {item.specs.length > 0 && (
                    <div className="spec-chips">
                      {item.specs.map((spec, i) => (
                        <span key={`${spec.label}-${i}`} className="spec-chip">
                          <em>{spec.label}</em>
                          {spec.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="catalog-action">
                    <button className="btn-request-quote" onClick={() => handleAddItem(item, true)}>
                      <i className="fas fa-file-invoice" aria-hidden="true"></i> Request Quote
                    </button>
                    <button className="btn-add-to-cart" onClick={() => handleAddItem(item)}>
                      <i className={cartItems.some((i) => i.key === item.key) ? 'fas fa-check' : 'fas fa-plus'}></i>{' '}
                      {cartItems.some((i) => i.key === item.key) ? 'In list' : 'Add to List'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {catalogSize === 0 && (
            <div className="empty-catalog-message">
              <p>The stock list is being updated. Please check back shortly, or email {ENQUIRY_EMAIL}.</p>
            </div>
          )}

          {catalogSize > 0 && total === 0 && (
            <div className="empty-catalog-message">
              <p>No items match your filters.</p>
              <button type="button" className="btn-load-more" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}

          {/* Real links, so crawlers can reach every item. */}
          {pageCount > 1 && (
            <nav className="load-more-container" aria-label="Catalogue pages">
              {page > 1 && (
                <Link className="btn-load-more" href={`/purchase${catalogQuery({ ...filters, page: page - 1 })}`} rel="prev">
                  <i className="fas fa-arrow-left" aria-hidden="true"></i> Previous
                </Link>
              )}
              <span className="result-count">
                Page {page} of {pageCount}
              </span>
              {page < pageCount && (
                <Link className="btn-load-more" href={`/purchase${catalogQuery({ ...filters, page: page + 1 })}`} rel="next">
                  Next <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Floating Cart Button */}
        {cartItems.length > 0 && (
          <button
            type="button"
            className="cart-fab"
            onClick={() => openCart('list')}
            aria-label={`Open enquiry list, ${cartItems.length} item${cartItems.length === 1 ? '' : 's'}`}
            key={fabPulse}
          >
            <i className="fas fa-clipboard-list fab-icon" aria-hidden="true"></i>
            <span className="cart-fab-label">Enquiry List</span>
            <span className="cart-fab-badge">{cartItems.length}</span>
          </button>
        )}

        {/* Right Side Drawer */}
        <div
          className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
          onClick={closeCart}
          aria-hidden={!isCartOpen}
        >
          <aside
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Your enquiry list"
          >
            <div className="cart-drawer-header">
              <div className="cart-drawer-heading">
                {cartStep === 'form' && (
                  <button
                    type="button"
                    className="cart-back-btn"
                    onClick={() => setCartStep('list')}
                    aria-label="Back to list"
                  >
                    <i className="fas fa-arrow-left" aria-hidden="true"></i>
                  </button>
                )}
                <div>
                  <h2 className="cart-drawer-title">
                    {cartStep === 'sent' ? 'Request Sent' : cartStep === 'form' ? 'Confirm Request' : 'Your Enquiry List'}
                  </h2>
                  <span className="cart-drawer-sub">
                    {cartStep === 'sent'
                      ? 'We will respond with a quotation'
                      : `${cartItems.length} item${cartItems.length === 1 ? '' : 's'}${
                          cartStep === 'form' ? ' · no prices shown until we quote' : ''
                        }`}
                  </span>
                </div>
              </div>

              <button type="button" className="cart-drawer-close" onClick={closeCart} aria-label="Close enquiry list">
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div className="cart-drawer-body">
              {cartStep === 'sent' ? (
                <div className="cart-drawer-empty">
                  <i className="fas fa-circle-check" aria-hidden="true"></i>
                  <p>Thank you &mdash; your request has been received.</p>
                  <span>
                    Our sales team will quote it. Once quoted, you can view and pay for it under My Requests.
                  </span>
                  <Link className="btn-load-more" href="/cost">
                    <i className="fas fa-list-check" aria-hidden="true"></i> Go to My Requests
                  </Link>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="cart-drawer-empty">
                  <i className="fas fa-box-open" aria-hidden="true"></i>
                  <p>Your enquiry list is empty.</p>
                  <span>Add items from the catalogue to get started.</span>
                </div>
              ) : cartStep === 'list' ? (
                <ul className="cart-rows">
                  {cartItems.map((item, index) => (
                    <li key={item.key} className="cart-row">
                      <div className="cart-row-thumb">
                        {item.image ? (
                          <img src={item.image} alt={item.title} loading="lazy" />
                        ) : (
                          <i className="fas fa-cubes" aria-hidden="true"></i>
                        )}
                        {(item.size || item.pressure) && (
                          <span className="cart-row-badge">{item.size || item.pressure}</span>
                        )}
                      </div>

                      <div className="cart-row-meta">
                        <h3 className="cart-row-title">{item.title}</h3>
                        <div className="cart-row-sub">
                          <span className="cart-qty-stepper">
                            <button
                              type="button"
                              onClick={() => handleCartChange(index, 'quantity', clampQty(Number(item.quantity) - 1))}
                              disabled={Number(item.quantity) <= 1}
                              aria-label={`Decrease quantity of ${item.title}`}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              inputMode="numeric"
                              value={item.quantity}
                              onChange={(e) => handleCartChange(index, 'quantity', e.target.value)}
                              onBlur={(e) => handleCartChange(index, 'quantity', clampQty(e.target.value))}
                              aria-label={`Quantity for ${item.title}`}
                            />
                            <button
                              type="button"
                              onClick={() => handleCartChange(index, 'quantity', clampQty(Number(item.quantity) + 1))}
                              aria-label={`Increase quantity of ${item.title}`}
                            >
                              +
                            </button>
                            <span className="cart-qty-unit">{item.unit}</span>
                          </span>
                          <span className="cart-stock-note">Ready stock</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => handleRemoveItem(index)}
                        aria-label={`Remove ${item.title}`}
                        title="Remove item"
                      >
                        <i className="fas fa-trash-alt" aria-hidden="true"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <form id="purchase-enquiry-form" className="enquiry-form" onSubmit={handleSubmit} noValidate>
                  <ul className="cart-rows">
                    {cartItems.map((item, index) => (
                      <li key={item.key} className="cart-row cart-checkout-row">
                        <div className="cart-row-meta">
                          <h3 className="cart-row-title">{item.title}</h3>
                          <span className="cart-stock-note">Code {item.itemCode}</span>

                          <div className="cart-checkout-fields">
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => handleCartChange(index, 'quantity', e.target.value)}
                              onBlur={(e) => handleCartChange(index, 'quantity', clampQty(e.target.value))}
                              className="purchase-input"
                              min="1"
                              step="1"
                              aria-label={`Quantity for ${item.title}`}
                            />
                            <textarea
                              placeholder="Remarks (optional)"
                              value={item.remarks}
                              onChange={(e) => handleCartChange(index, 'remarks', e.target.value)}
                              className="purchase-textarea"
                              rows={2}
                              aria-label={`Remarks for ${item.title}`}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => handleRemoveItem(index)}
                          aria-label={`Remove ${item.title}`}
                          title="Remove item"
                        >
                          <i className="fas fa-trash-alt" aria-hidden="true"></i>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="enquiry-fields">
                    {/* Name, company, email, GST and phone come from the signed-in account. */}
                    <div className="purchase-form-group full-width-field">
                      <label htmlFor="enq-message">Requirement notes</label>
                      <textarea
                        id="enq-message"
                        className="purchase-textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Delivery location, required despatch date, inspection or test certificate needs."
                      />
                    </div>
                  </div>

                  {submitError && <p className="error-text enquiry-error">{submitError}</p>}
                </form>
              )}
            </div>

            {cartStep !== 'sent' && cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                {cartStep === 'list' ? (
                  <button type="button" className="btn-primary cart-footer-btn" onClick={() => setCartStep('form')}>
                    Request Quote <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </button>
                ) : !isSignedIn ? (
                  // The list is kept in localStorage, so it is still here after signing in.
                  <Link href="/login?next=/purchase" className="btn-primary cart-footer-btn">
                    Sign in to send request <i className="fas fa-right-to-bracket" aria-hidden="true"></i>
                  </Link>
                ) : (
                  <button
                    type="submit"
                    form="purchase-enquiry-form"
                    className="btn-primary cart-footer-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Submit Request'}{' '}
                    <i className="fas fa-paper-plane" aria-hidden="true"></i>
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
