'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChangeEvent, PointerEvent } from 'react';
import { RAZORPAY_KEY_ID } from '@/lib/purchaseConfig';

interface MasterItem {
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
}

interface CartItem extends MasterItem {
  quantity: string;
  remarks: string;
}

interface ParsedSpecs {
  size: string | null;
  pressure: string | null;
  title: string;
  specs: { label: string; value: string }[];
}

const parseItemSpecs = (itemName: string): ParsedSpecs => {
  const name = (itemName || '').trim();
  const upper = name.toUpperCase();

  const sizeMatch = name.match(/\b(\d+)\s*MM\b/i);
  const size = sizeMatch ? `${sizeMatch[1]}MM` : null;

  const pnMatch = name.match(/\bPN-?\s*(\d+)\b/i);
  const classMatch = name.match(/\bCLASS\s*(\d+)/i);
  const pressure = pnMatch
    ? `PN-${pnMatch[1]}`
    : classMatch
      ? `Class ${classMatch[1]}#`
      : null;

  const specs: { label: string; value: string }[] = [];

  if (/METAL TO METAL/.test(upper)) specs.push({ label: 'Seat', value: 'Metal to Metal' });
  else if (/METAL TO RUBBER|RESILE?NT SEATED/.test(upper)) specs.push({ label: 'Seat', value: 'Metal to Rubber' });

  if (/LEVER OPERATED/.test(upper)) specs.push({ label: 'Operation', value: 'Lever' });
  else if (/GEAR OPERATED|GEAR BOX|GEAR$|GEAR /.test(upper)) specs.push({ label: 'Operation', value: 'Gear' });
  else if (/HW OP|HANDWHEEL|HAND WHEEL/.test(upper)) specs.push({ label: 'Operation', value: 'Handwheel' });

  if (/DOUBLE FLANGE/.test(upper)) specs.push({ label: 'End', value: 'Double Flanged' });
  else if (/FLANGE TYPE|FLANGE END|FLANGE/.test(upper)) specs.push({ label: 'End', value: 'Flanged' });
  else if (/WAFER/.test(upper)) specs.push({ label: 'End', value: 'Wafer' });
  else if (/BUTT WELD/.test(upper)) specs.push({ label: 'End', value: 'Butt Weld' });
  else if (/SCREWED|THREADED/.test(upper)) specs.push({ label: 'End', value: 'Screwed' });

  if (/DUCTILE IRON/.test(upper)) specs.push({ label: 'MOC', value: 'Ductile Iron' });
  else if (/CAST STEEL|CARBON STEEL/.test(upper)) specs.push({ label: 'MOC', value: 'Cast Steel' });
  else if (/BRONZE|BRASS|GUN METAL/.test(upper)) specs.push({ label: 'MOC', value: 'Bronze' });
  else if (/STAINLESS/.test(upper)) specs.push({ label: 'MOC', value: 'Stainless Steel' });

  if (/2-PIECE/.test(upper)) specs.push({ label: 'Design', value: '2-Piece' });
  else if (/3-PIECE/.test(upper)) specs.push({ label: 'Design', value: '3-Piece' });

  const title = name
    .replace(/\b\d+\s*MM\b/gi, ' ')
    .replace(/\bPN-?\s*\d+\b/gi, ' ')
    .replace(/\bCLASS\s*\d+\s*#?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { size, pressure, title: title || name, specs };
};

const TILT_MAX_DEG = 5;
const TILT_EASE = 0.075;
const GLIDE_EASE = 0.12;
const RETURN_EASE = 0.1;

/* Consumables / tools / stationery lines that are not part of the valve catalog.
   Matched as a case-insensitive prefix so variants such as
   "TOOLS & FIXTURES 6NM AIR WRENCH..." are covered too. */
const EXCLUDED_ITEM_PREFIXES = [
  'CONSUMABLES ENAMEL PAINT- BLUE',
  'CONSUMABLES THINNER STD',
  'OIL & LUBE GREASE STD',
  'PRINTING & STATIONERY',
  'WASTAGE BUBBLE WRAP PLASTIC',
  'TOOLS & FIXTURES',
];

const isExcludedItem = (itemName: string) => {
  const name = (itemName || '').toUpperCase();
  return EXCLUDED_ITEM_PREFIXES.some((prefix) => name.startsWith(prefix));
};

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

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export default function Purchase() {
  const [masterItems, setMasterItems] = useState<MasterItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'list' | 'checkout'>('list');
  const [fabPulse, setFabPulse] = useState(0);
  const tilt = useCardTilt();

  const openCart = useCallback(() => {
    setCartStep('list');
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

  // Fetch the extracted items on mount
  useEffect(() => {
    fetch('/purchaseItems.json')
      .then((res) => res.json())
      .then((data: MasterItem[]) => setMasterItems(data.filter((item) => !isExcludedItem(item.itemName))))
      .catch((err) => console.error('Error loading master items:', err));
  }, []);

  // Helper to extract base category name (words before any number)
  const extractCategoryName = (name: string): string | null => {
    if (!name) return null;
    const parts = name.split(' ');
    const cat: string[] = [];
    for (const p of parts) {
      if (/\d/.test(p)) break;
      cat.push(p);
    }
    const result = cat.join(' ').trim();
    return result ? result : name.split(' ').slice(0, 2).join(' ');
  };

  // Derive unique categories from item names
  const uniqueCategories = Array.from(
    new Set(
      masterItems
        .map((item) => extractCategoryName(item.itemName))
        .filter((cat): cat is string => !!cat && cat.trim() !== '')
    )
  ).sort();

  // Derive sub-categories based on selected category or hovered category
  const getSubCategoriesFor = (cat: string): string[] => {
    return Array.from(
      new Set(
        masterItems
          .filter((item) => extractCategoryName(item.itemName) === cat)
          .map((item) => item.itemName)
          .filter(Boolean)
      )
    ).sort();
  };

  // Helper to get image based on item name keywords
  const getItemImage = (itemName: string): string => {
    if (!itemName) return '/uploads/valves.jpg'; // default fallback
    const name = itemName.toUpperCase();

    // Sluice Valves
    if (name.includes('SLUICE VALVE') || name.includes('GATE VALVE')) {
      if (name.includes('CLASS 150#')) return '/purchase img/Cast Steel Gate Valve (Class 150#).jpeg';
      if (name.includes('CLASS 300#')) return '/purchase img/Cast Steel Gate Valve (Class 300#).jpeg';
      if (name.includes('CLASS 800#')) return '/purchase img/Forged Steel Gate Valve (Class 800#).jpeg';
      if (name.includes('METAL TO METAL') && name.includes('NON-RISING')) return '/purchase img/Metal Seated Sluice Valve (non Rising).jpeg';
      if (name.includes('METAL TO METAL') && name.includes('RISING')) return '/purchase img/Metal Seated Sluice Valve (Rising Spindle).jpeg';
      if (name.includes('NON-RISING')) return '/purchase img/Sluice valve (non rising).jpeg';
      if (name.includes('RISING')) return '/purchase img/Sluice valve (Rising Spindle) resilent Seated.jpeg';
      return '/purchase img/Sluice Gate Valve.jpeg';
    }

    // Butterfly Valves
    if (name.includes('BUTTERFLY VALVE')) {
      if (name.includes('WAFER TYPE')) return '/purchase img/Wafer Type butterfly valve.jpeg';
      if (name.includes('LUG TYPE') && name.includes('METAL TO METAL')) return '/purchase img/Lug type (Metal to Metal ) butterfly valve.jpeg';
      if (name.includes('LUG TYPE')) return '/purchase img/Lug type (Metal to Rubber) butterfly valve.jpeg';
      if (name.includes('FLANGE TYPE') && name.includes('METAL')) return '/purchase img/Double Flange Metal Seated Butterfly Valve.jpeg';
      if (name.includes('FLANGE TYPE')) return '/purchase img/Double Flange Resilent Seated Butterfly Valve.jpeg';
      return '/purchase img/Double Flange Resilent Seated Butterfly Valve.jpeg';
    }

    // Ball Valves
    if (name.includes('BALL VALVE')) {
      if (name.includes('2-PIECE')) return '/purchase img/2 piece ball valve.jpeg';
      if (name.includes('3-PIECE')) return '/purchase img/3 piece ball valve.jpeg';
      if (name.includes('SCREWED')) return '/purchase img/screw ball valve.jpeg';
      return '/purchase img/3 piece ball valve.jpeg';
    }

    // Check Valves & DPCV
    if (name.includes('DPCV')) return '/purchase img/Dual Plate Check Valve (API594).jpeg';
    if (name.includes('CHECK VALVE')) return '/purchase img/Non return check valve (IS5312, Part-1.jpeg';

    // Diaphragm Valves
    if (name.includes('DIAPHRAGM')) return '/purchase img/Diaphragm Valve.jpeg';

    // Dismantling Joints
    if (name.includes('DISMANTLING')) return '/purchase img/Dismantling joint.jpeg';

    // Float Valves
    if (name.includes('FLOAT')) return '/purchase img/Float Valve.jpeg';

    // Globe Valves
    if (name.includes('GLOBE')) return '/purchase img/Globe Valve.jpeg';

    // Air Valves
    if (name.includes('AIR VALVE') || name.includes('KINETIC')) return '/purchase img/Kinetic Air Valve (DK type).jpeg';

    // Flanges
    if (name.includes('FLANGE') && !name.includes('BUTTERFLY')) return '/purchase img/MS companion flange.jpeg';

    // Pressure Relief Valves
    if (name.includes('RELIEF')) return '/purchase img/Pressure relief valve (Spring loaded).jpeg';

    // Knife Gate Valves
    if (name.includes('KNIFE GATE')) return '/purchase img/knife gate Valve.jpeg';

    // Needle Valves
    if (name.includes('NEEDLE')) return '/purchase img/needle valve.jpeg';

    // Pressure Reducing Valves (PRV)
    if (name.includes('REDUCING') || name.includes('PRV')) return '/purchase img/pressure reducing valve.jpeg';

    // Solenoid Valves
    if (name.includes('SOLENOID')) return '/purchase img/solenoid Valve.jpeg';

    // Fallback
    return '/uploads/valves.jpg';
  };

  // Handle Search Input & Filter
  const filteredItems = masterItems.filter((item) => {
    // Search match
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      matchesSearch =
        Boolean(item.itemName && item.itemName.toLowerCase().includes(term)) ||
        Boolean(item.itemCode && item.itemCode.toLowerCase().includes(term));
    }

    // Category match
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const itemCat = extractCategoryName(item.itemName);
      matchesCategory = itemCat === selectedCategory;
    }

    // Sub-Category match
    let matchesSubCategory = true;
    if (selectedSubCategory !== 'All') {
      matchesSubCategory = item.itemName === selectedSubCategory;
    }

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const uniqueFilteredItems = filteredItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.itemCode === item.itemCode)
  );

  const displayedItems = uniqueFilteredItems.slice(0, displayCount);
  const hasMore = displayCount < uniqueFilteredItems.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(12); // Reset count on new search
  };

  const handleAddItem = (masterItem: MasterItem) => {
    // Check if already added
    if (cartItems.some((i) => i.itemCode === masterItem.itemCode)) {
      alert('This item is already in your purchase list!');
      return;
    }

    setCartItems([
      ...cartItems,
      {
        ...masterItem,
        quantity: '1',
        remarks: '',
      },
    ]);
    setFabPulse((n) => n + 1);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);

    if (updatedItems.length === 0) {
      setIsCartOpen(false);
      setCartStep('list');
    }
  };

  const handleCartChange = (index: number, field: keyof Pick<CartItem, 'quantity' | 'remarks'>, value: string) => {
    const updatedItems = [...cartItems];
    updatedItems[index][field] = value;
    setCartItems(updatedItems);
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID, // Test Key Placeholder
      amount: 500000, // ₹500
      currency: 'INR',
      name: 'GM Dalui & Sons',
      description: 'Purchase Order Payment',
      handler: function (response: { razorpay_payment_id: string }) {
        alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
        console.log('Payment details:', response);
        console.log('Purchased Items:', cartItems);
        setCartItems([]); // Clear cart after successful payment
        setIsCartOpen(false);
        setCartStep('list');
      },
      theme: {
        color: '#111827',
      },
    };

    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load');
      return;
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      alert('Please add at least one item to purchase.');
      return;
    }
    // Proceed to payment
    handlePayment();
  };

  return (
    <div className="purchase-page-wrapper">
      <div className="purchase-hero">
        <div className="container">
          <h1 className="purchase-hero-title">Purchase Request</h1>
          <p className="purchase-hero-subtitle">
            Browse our catalog or search for specific items to add to your purchase list.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search & Filter Section */}
        <div className="purchase-search-section">
          <div className="filter-controls-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div className="search-box-container static-search" style={{ flex: 1, margin: 0 }}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="purchase-search-input"
                placeholder="Search by Item Code or Description (e.g. SLUICE VALVE 40MM)"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="category-filter-container custom-dropdown-container">
              {/* Invisible Backdrop for closing on outside click */}
              {isDropdownOpen && (
                <div
                  className="dropdown-backdrop"
                  style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setHoveredCategory(null);
                  }}
                />
              )}

              <button
                className="custom-dropdown-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ position: 'relative', zIndex: 1000 }}
              >
                {selectedSubCategory !== 'All'
                  ? selectedSubCategory
                  : selectedCategory !== 'All'
                  ? selectedCategory
                  : 'All Item Types'}
                <i className="fas fa-chevron-down"></i>
              </button>

              {isDropdownOpen && (
                <div
                  className="custom-dropdown-panel"
                  style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, zIndex: 1000, marginTop: '5px' }}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Main Menu */}
                  <ul className="custom-dropdown-menu" style={{ position: 'relative', top: 0, left: 0, marginTop: 0, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <li
                      className="custom-dropdown-item"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedSubCategory('All');
                        setIsDropdownOpen(false);
                        setDisplayCount(12);
                      }}
                      onMouseEnter={() => setHoveredCategory(null)}
                    >
                      All Item Types
                    </li>
                    {uniqueCategories.map((cat) => (
                      <li
                        key={cat}
                        className={`custom-dropdown-item has-submenu ${hoveredCategory === cat ? 'active-hover' : ''}`}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat);
                          setSelectedSubCategory('All');
                          setIsDropdownOpen(false);
                          setDisplayCount(12);
                        }}
                      >
                        <span>{cat}</span>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>

                  {/* Submenu renders next to main menu when hovering */}
                  {hoveredCategory && (
                    <ul
                      className="custom-submenu"
                      style={{
                        position: 'relative',
                        top: 0,
                        left: 0,
                        marginLeft: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        borderLeft: '2px solid #0b1c47',
                      }}
                    >
                      <li
                        className="custom-submenu-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(hoveredCategory);
                          setSelectedSubCategory('All');
                          setIsDropdownOpen(false);
                          setDisplayCount(12);
                        }}
                      >
                        <strong>All {hoveredCategory}s</strong>
                      </li>
                      {getSubCategoriesFor(hoveredCategory).map((subCat) => (
                        <li
                          key={subCat}
                          className="custom-submenu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(hoveredCategory);
                            setSelectedSubCategory(subCat);
                            setIsDropdownOpen(false);
                            setDisplayCount(12);
                          }}
                        >
                          {subCat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="catalog-section">
          <h2 className="section-heading">Available Items</h2>
          <div className="purchase-grid">
            {displayedItems.map((item) => {
              const parsed = parseItemSpecs(item.itemName);

              return (
                <div key={item.itemCode} className="purchase-card catalog-card" {...tilt}>
                  <span className="card-accent-bar" aria-hidden="true" />
                  <span className="card-glare" aria-hidden="true" />

                  <div className="purchase-media">
                    <img
                      src={getItemImage(item.itemName)}
                      alt={parsed.title}
                      className="purchase-media-img"
                      loading="lazy"
                    />

                    {parsed.size && (
                      <span className="size-badge-overlay">
                        <i className="fas fa-ruler-combined badge-icon" aria-hidden="true"></i>
                        {parsed.size}
                      </span>
                    )}

                    {parsed.pressure && (
                      <span className="pressure-badge-overlay">
                        <i className="fas fa-gauge-high badge-icon" aria-hidden="true"></i>
                        {parsed.pressure}
                      </span>
                    )}
                  </div>

                  <div className="purchase-body">
                    <div className="purchase-meta">
                      <span className="item-cat-badge">{item.category}</span>
                    </div>

                    <h3 className="item-title">{parsed.title}</h3>

                    {parsed.specs.length > 0 && (
                      <div className="spec-chips">
                        {parsed.specs.map((spec, i) => (
                          <span key={`${spec.label}-${i}`} className="spec-chip">
                            <em>{spec.label}</em>
                            {spec.value}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="catalog-action">
                      <button className="btn-add-to-cart" onClick={() => handleAddItem(item)}>
                        <i className="fas fa-plus"></i> Add to List
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {uniqueFilteredItems.length === 0 && (
            <div className="empty-catalog-message">
              <p>No items found matching &quot;{searchTerm}&quot;</p>
            </div>
          )}

          {hasMore && (
            <div className="load-more-container">
              <button className="btn-load-more" onClick={handleLoadMore}>
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
            onClick={openCart}
            aria-label={`Open purchase list, ${cartItems.length} item${cartItems.length === 1 ? '' : 's'}`}
            key={fabPulse}
          >
            <i className="fas fa-clipboard-list fab-icon" aria-hidden="true"></i>
            <span className="cart-fab-badge">{cartItems.length}</span>
            <span className="cart-fab-label">Purchase List</span>
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
            aria-label="Your Purchase List"
          >
            <div className="cart-drawer-header">
              <div className="cart-drawer-heading">
                {cartStep === 'checkout' && (
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
                    {cartStep === 'checkout' ? 'Review & Pay' : 'Your Purchase List'}
                  </h2>
                  <span className="cart-drawer-sub">
                    {cartItems.length} item{cartItems.length === 1 ? '' : 's'}
                    {cartStep === 'checkout' ? ' · confirm quantity and remarks' : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="cart-drawer-close"
                onClick={closeCart}
                aria-label="Close purchase list"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="cart-drawer-empty">
                  <i className="fas fa-box-open" aria-hidden="true"></i>
                  <p>Your purchase list is empty.</p>
                  <span>Add items from the catalog to get started.</span>
                </div>
              ) : cartStep === 'list' ? (
                <ul className="cart-rows">
                  {cartItems.map((item, index) => {
                    const parsed = parseItemSpecs(item.itemName);
                    const overlayText = parsed.size || parsed.pressure;
                    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

                    return (
                      <li key={`cart-${item.itemCode}`} className="cart-row">
                        <div className="cart-row-thumb">
                          <img src={getItemImage(item.itemName)} alt={parsed.title} />
                          {overlayText && <span className="cart-row-badge">{overlayText}</span>}
                        </div>

                        <div className="cart-row-meta">
                          <h3 className="cart-row-title">{parsed.title}</h3>
                          <div className="cart-row-sub">
                            <span className="cart-qty-pill">
                              Qty <strong>{qty}</strong> {item.unit}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => handleRemoveItem(index)}
                          aria-label={`Remove ${parsed.title}`}
                          title="Remove Item"
                        >
                          <i className="fas fa-trash-alt" aria-hidden="true"></i>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="cart-rows">
                  {cartItems.map((item, index) => {
                    const parsed = parseItemSpecs(item.itemName);

                    return (
                      <li key={`checkout-${item.itemCode}`} className="cart-row cart-checkout-row">
                        <div className="cart-row-thumb">
                          <img src={getItemImage(item.itemName)} alt={parsed.title} />
                        </div>

                        <div className="cart-row-meta">
                          <h3 className="cart-row-title">{parsed.title}</h3>

                          <div className="cart-checkout-fields">
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => handleCartChange(index, 'quantity', e.target.value)}
                              className="purchase-input"
                              min="1"
                              aria-label={`Quantity for ${parsed.title}`}
                            />
                            <textarea
                              placeholder="Remarks (Optional)"
                              value={item.remarks}
                              onChange={(e) => handleCartChange(index, 'remarks', e.target.value)}
                              className="purchase-textarea"
                              rows={2}
                              aria-label={`Remarks for ${parsed.title}`}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => handleRemoveItem(index)}
                          aria-label={`Remove ${parsed.title}`}
                          title="Remove Item"
                        >
                          <i className="fas fa-trash-alt" aria-hidden="true"></i>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                {cartStep === 'list' ? (
                  <button type="button" className="btn-primary cart-footer-btn" onClick={() => setCartStep('checkout')}>
                    Proceed to Checkout <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} className="btn-primary cart-footer-btn">
                    Submit Request &amp; Pay <i className="fas fa-credit-card" aria-hidden="true"></i>
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
