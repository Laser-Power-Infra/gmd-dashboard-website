'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { FormEvent, PointerEvent } from 'react';

import DebouncedSearchInput from '@/components/technical/DebouncedSearchInput';
import { buildStock, type MasterRow, type StockItem } from '@/app/purchase/catalog';

interface CartItem {
  key: string;
  itemCode: string;
  name: string;
  title: string;
  unit: string;
  image: string | null;
  size: string | null;
  pressure: string | null;
  /** Units held in stock, for the "x of N in stock" hint. */
  inStock: number;
  quantity: string;
  remarks: string;
}

interface BuyerDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_BUYER: BuyerDetails = { name: '', company: '', email: '', phone: '', message: '' };

const ENQUIRY_EMAIL = 'info@gmdalui.co.in';

const ALL = 'All';
const PAGE_SIZE = 12;

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
function enquiryText(buyer: BuyerDetails, items: CartItem[]): string {
  const lines = items.map(
    (i, n) =>
      `${n + 1}. ${i.name} [${i.itemCode}] - qty ${Number(i.quantity) > 0 ? i.quantity : 1} ${i.unit}` +
      (i.remarks ? ` - ${i.remarks}` : '')
  );
  return [
    `Name: ${buyer.name}`,
    `Company: ${buyer.company || '-'}`,
    `Email: ${buyer.email}`,
    `Phone: ${buyer.phone}`,
    '',
    'Items:',
    ...lines,
    '',
    buyer.message ? `Notes: ${buyer.message}` : '',
  ].join('\n');
}

export default function Purchase() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [sizeFilter, setSizeFilter] = useState(ALL);
  const [pnFilter, setPnFilter] = useState(ALL);
  const [mocFilter, setMocFilter] = useState(ALL);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'list' | 'form' | 'sent'>('list');
  const [buyer, setBuyer] = useState<BuyerDetails>(EMPTY_BUYER);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BuyerDetails, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentSnapshot, setSentSnapshot] = useState('');
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

  // The JSON is one row per physical unit; buildStock collapses it to one entry
  // per item carrying the unit count as `qty`.
  useEffect(() => {
    fetch('/purchaseItems.json')
      .then((res) => res.json())
      .then((data: MasterRow[]) => setStock(buildStock(data)))
      .catch((err) => {
        console.error('Error loading stock list:', err);
        setLoadError(true);
      });
  }, []);

  const options = useMemo(() => {
    const types = new Set<string>();
    const sizes = new Map<number, string>();
    const pns = new Set<string>();
    const mocs = new Set<string>();
    for (const item of stock) {
      types.add(item.type);
      if (item.size && item.sizeMm !== null) sizes.set(item.sizeMm, item.size);
      if (item.pressure) pns.add(item.pressure);
      if (item.moc) mocs.add(item.moc);
    }
    return {
      types: [...types].sort(),
      sizes: [...sizes.entries()].sort((a, b) => a[0] - b[0]).map(([, label]) => label),
      pns: [...pns].sort(),
      mocs: [...mocs].sort(),
    };
  }, [stock]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return stock.filter((item) => {
      if (term && !item.name.toLowerCase().includes(term) && !item.itemCode.toLowerCase().includes(term))
        return false;
      if (typeFilter !== ALL && item.type !== typeFilter) return false;
      if (sizeFilter !== ALL && item.size !== sizeFilter) return false;
      if (pnFilter !== ALL && item.pressure !== pnFilter) return false;
      if (mocFilter !== ALL && item.moc !== mocFilter) return false;
      return true;
    });
  }, [stock, searchTerm, typeFilter, sizeFilter, pnFilter, mocFilter]);

  const displayedItems = filteredItems.slice(0, displayCount);
  const hasMore = displayCount < filteredItems.length;
  const activeFilters = [typeFilter, sizeFilter, pnFilter, mocFilter].filter((f) => f !== ALL).length;

  const commitSearch = useCallback((val: string) => {
    setSearchTerm(val);
    setDisplayCount(PAGE_SIZE);
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter(ALL);
    setSizeFilter(ALL);
    setPnFilter(ALL);
    setMocFilter(ALL);
    setDisplayCount(PAGE_SIZE);
  };

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
          inStock: item.qty,
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

  const handleBuyerChange = (field: keyof BuyerDetails, value: string) => {
    setBuyer((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors: Partial<Record<keyof BuyerDetails, string>> = {};
    if (buyer.name.trim().length < 2) errors.name = 'Full name is required';
    if (!/\S+@\S+\.\S+/.test(buyer.email.trim())) errors.email = 'Enter a valid email address';
    if (buyer.phone.trim().length < 6) errors.phone = 'Enter a valid phone number';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/purchase-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...buyer,
          items: cartItems.map((i) => ({
            itemCode: i.itemCode,
            itemName: i.name,
            quantity: Number(i.quantity) > 0 ? Number(i.quantity) : 1,
            remarks: i.remarks,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const fieldError = data.errors && Object.values(data.errors).flat()[0];
        throw new Error(fieldError || data.error || 'Could not send your enquiry.');
      }
      setSentSnapshot(enquiryText(buyer, cartItems));
      setCartStep('sent');
      setCartItems([]);
      setBuyer(EMPTY_BUYER);
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
        </div>
      </div>

      <div className="container">
        {/* Search & Filter Section */}
        <div className="purchase-search-section">
          <div className="filter-controls-container">
            <div className="search-box-container static-search">
              <i className="fas fa-search search-icon" aria-hidden="true"></i>
              <DebouncedSearchInput
                value={searchTerm}
                onCommit={commitSearch}
                placeholder="Search by item code or description (e.g. SLUICE VALVE 40MM)"
                className="purchase-search-input"
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
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setDisplayCount(PAGE_SIZE);
                  }}
                >
                  <option value={ALL}>All types</option>
                  {options.types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>Size</span>
                <select
                  value={sizeFilter}
                  onChange={(e) => {
                    setSizeFilter(e.target.value);
                    setDisplayCount(PAGE_SIZE);
                  }}
                >
                  <option value={ALL}>All sizes</option>
                  {options.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>Pressure</span>
                <select
                  value={pnFilter}
                  onChange={(e) => {
                    setPnFilter(e.target.value);
                    setDisplayCount(PAGE_SIZE);
                  }}
                >
                  <option value={ALL}>All ratings</option>
                  {options.pns.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="purchase-filter">
                <span>MOC</span>
                <select
                  value={mocFilter}
                  onChange={(e) => {
                    setMocFilter(e.target.value);
                    setDisplayCount(PAGE_SIZE);
                  }}
                >
                  <option value={ALL}>All materials</option>
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
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="catalog-section">
          <h2 className="section-heading">
            Available Items
            {stock.length > 0 && <span className="result-count">{filteredItems.length} of {stock.length}</span>}
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
                    <span className="item-cat-badge">{item.category}</span>
                    <span className="stock-badge">
                      <i className="fas fa-circle-check" aria-hidden="true"></i>
                      Ready stock &middot; {item.qty} {item.unit}
                    </span>
                  </div>

                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-code-line">Code {item.itemCode}</p>

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

          {loadError && (
            <div className="empty-catalog-message">
              <p>The stock list could not be loaded. Please refresh, or email {ENQUIRY_EMAIL}.</p>
            </div>
          )}

          {!loadError && stock.length > 0 && filteredItems.length === 0 && (
            <div className="empty-catalog-message">
              <p>No items match your filters.</p>
              <button type="button" className="btn-load-more" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}

          {hasMore && (
            <div className="load-more-container">
              <button className="btn-load-more" onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}>
                View More
              </button>
            </div>
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
                    {cartStep === 'sent' ? 'Enquiry Sent' : cartStep === 'form' ? 'Your Details' : 'Your Enquiry List'}
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
                  <p>Thank you &mdash; your enquiry has been received.</p>
                  <span>
                    Our sales team will come back with a quotation. You can also send the same list straight from your
                    mail app:
                  </span>
                  <a
                    className="btn-load-more"
                    href={`mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
                      'Stock enquiry from gmdalui.co.in'
                    )}&body=${encodeURIComponent(sentSnapshot)}`}
                  >
                    <i className="fas fa-envelope" aria-hidden="true"></i> Email a copy to {ENQUIRY_EMAIL}
                  </a>
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
                          <img src={item.image} alt={item.title} />
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
                          <span className="cart-qty-pill">
                            Qty <strong>{Number(item.quantity) > 0 ? item.quantity : 1}</strong> {item.unit}
                          </span>
                          <span className="cart-stock-note">{item.inStock} in stock</span>
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
                          <span className="cart-stock-note">
                            Code {item.itemCode} &middot; {item.inStock} in stock
                          </span>

                          <div className="cart-checkout-fields">
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => handleCartChange(index, 'quantity', e.target.value)}
                              className="purchase-input"
                              min="1"
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
                    <div className="purchase-form-group">
                      <label htmlFor="enq-name">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        id="enq-name"
                        className={`purchase-input ${formErrors.name ? 'input-error' : ''}`}
                        value={buyer.name}
                        onChange={(e) => handleBuyerChange('name', e.target.value)}
                        autoComplete="name"
                      />
                      {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                    </div>

                    <div className="purchase-form-group">
                      <label htmlFor="enq-company">Company</label>
                      <input
                        id="enq-company"
                        className="purchase-input"
                        value={buyer.company}
                        onChange={(e) => handleBuyerChange('company', e.target.value)}
                        autoComplete="organization"
                      />
                    </div>

                    <div className="purchase-form-group">
                      <label htmlFor="enq-email">
                        Email <span className="req">*</span>
                      </label>
                      <input
                        id="enq-email"
                        type="email"
                        className={`purchase-input ${formErrors.email ? 'input-error' : ''}`}
                        value={buyer.email}
                        onChange={(e) => handleBuyerChange('email', e.target.value)}
                        autoComplete="email"
                      />
                      {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    </div>

                    <div className="purchase-form-group">
                      <label htmlFor="enq-phone">
                        Phone <span className="req">*</span>
                      </label>
                      <input
                        id="enq-phone"
                        type="tel"
                        className={`purchase-input ${formErrors.phone ? 'input-error' : ''}`}
                        value={buyer.phone}
                        onChange={(e) => handleBuyerChange('phone', e.target.value)}
                        autoComplete="tel"
                      />
                      {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                    </div>

                    <div className="purchase-form-group full-width-field">
                      <label htmlFor="enq-message">Requirement notes</label>
                      <textarea
                        id="enq-message"
                        className="purchase-textarea"
                        rows={3}
                        value={buyer.message}
                        onChange={(e) => handleBuyerChange('message', e.target.value)}
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
                ) : (
                  <button
                    type="submit"
                    form="purchase-enquiry-form"
                    className="btn-primary cart-footer-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send Enquiry'}{' '}
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
