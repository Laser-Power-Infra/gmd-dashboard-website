'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/auth/SignOutButton';
import { useRouter } from 'next/navigation';

import {
  FACETS,
  catalogQuery,
  displayName,
  toggle,
  type CatalogFilters,
  type FacetKey,
  type StockItem,
} from '@/app/purchase/catalog';
import type { TypeTile } from '@/app/purchase/data';
import { archivo } from '@/lib/fonts';
import { MAX_NOTES, MAX_QTY, MAX_REMARKS, clampQty, qtyError, useEnquiryList, type ListItem } from './useEnquiryList';
import s from './purchase.module.css';

const BASE = '/purchase';
const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
/** "200MM" -> "200"; the unit is set separately, smaller. */
const bore = (size: string) => size.replace(/MM$/i, '');
/** "PN-16" -> "PN 16"; class ratings pass through. */
const rating = (p: string) => p.replace(/^PN-?/i, 'PN ');

/** Types listed before "Show all"; the showcase is already sorted by stock count. */
const TOP_TYPES = 8;

interface Props {
  items: StockItem[];
  total: number;
  catalogSize: number;
  options: { types: string[]; sizes: string[]; pns: string[]; mocs: string[] };
  showcase: TypeTile[];
  filters: CatalogFilters;
  pageCount: number;
  isSignedIn: boolean;
}

/** Simple gate-valve outline for items without a photo. */
function ValveGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={s.glyph}>
      <path d="M24 6v10M17 6h14M14 16h20v8H14zM6 24h36v12H6zM16 36v6M32 36v6" />
    </svg>
  );
}

/**
 * /purchase - the familiar shop layout: filters in a left sidebar, cards on
 * the right, and the list in a drawer that opens from the header. Every filter
 * is a URL, so the server does the filtering and each view can be linked.
 */
export default function PurchasePage({
  items,
  total,
  catalogSize,
  options,
  showcase,
  filters,
  pageCount,
  isSignedIn,
}: Props) {
  const router = useRouter();
  const list = useEnquiryList();
  const [open, setOpen] = useState<null | 'list' | 'filters'>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // One scroll for the whole page - the sidebar has no scrollbar of its own.
  // If it fits the screen it pins 16px from the top. If it is taller, its sticky
  // offset goes negative by the overflow, so it scrolls up with the page until
  // its last option is in view and only then pins. Its end is always reachable.
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const place = () => {
      const top = Math.min(16, window.innerHeight - el.offsetHeight - 16);
      el.style.setProperty('--sidebar-top', `${top}px`);
    };
    place();
    const ro = new ResizeObserver(place); // the type list expands/collapses
    ro.observe(el);
    window.addEventListener('resize', place);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, []);

  const href = (patch: Partial<CatalogFilters>) => `${BASE}${catalogQuery({ ...filters, page: 1, ...patch })}`;
  const go = (patch: Partial<CatalogFilters>) => router.push(href(patch), { scroll: false });

  // Sheets: Escape closes, the page behind holds still, focus moves into the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    sheetRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go({ q: String(new FormData(e.currentTarget).get('q') ?? '').trim() });
  };

  // Every selected value, in the words the buyer chose it by - each removable on its own.
  const label: Record<FacetKey, (v: string) => string> = {
    type: displayName,
    size: (v) => `${bore(v)} mm`,
    pn: rating,
    moc: (v) => v,
  };
  const active: { id: string; label: string; remove: string }[] = [
    ...(filters.q ? [{ id: 'q', label: `"${filters.q}"`, remove: href({ q: '' }) }] : []),
    ...FACETS.flatMap((k) =>
      filters[k].map((v) => ({ id: `${k}:${v}`, label: label[k](v), remove: href({ [k]: toggle(filters[k], v) }) }))
    ),
  ];

  const count = list.items.length;
  const listTotal = list.totalPaise != null ? rupees(list.totalPaise / 100) : null;

  const sidebar = (
    <FilterSidebar
      filters={filters}
      options={options}
      showcase={showcase}
      href={href}
      anyActive={active.length > 0}
    />
  );

  return (
    <div className={`${archivo.variable} ${s.page}`}>
      <div className={s.frame}>
        <header className={s.header}>
          <div className={s.heading}>
            <h1 className={s.title}>Ready stock</h1>
            <p className={s.lede}>
              {catalogSize.toLocaleString('en-IN')} valves and spares, priced and ready to despatch from our Howrah
              works.
            </p>
          </div>

          <form className={s.search} role="search" method="get" action={BASE} onSubmit={onSearch}>
            <label htmlFor="stock-q" className={s.srOnly}>
              Search by name or item code
            </label>
            <svg viewBox="0 0 20 20" aria-hidden="true" className={s.searchIcon}>
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M13 13l4 4" />
            </svg>
            <input
              id="stock-q"
              name="q"
              type="search"
              defaultValue={filters.q}
              key={filters.q}
              placeholder="Search by name or item code"
              maxLength={100}
            />
            {/* Keep every selected filter when searching without JavaScript. */}
            {FACETS.flatMap((k) => filters[k].map((v) => <input key={`${k}:${v}`} type="hidden" name={k} value={v} />))}
          </form>

          <div className={s.headerActions}>
            {/* The site header has no account control, so the catalogue carries its own. */}
            {isSignedIn ? (
              <SignOutButton className={s.authLink}>Sign out</SignOutButton>
            ) : (
              <Link href={`/login?next=${BASE}`} className={s.authLink}>
                Sign in
              </Link>
            )}
            <button type="button" className={s.filtersButton} onClick={() => setOpen('filters')}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3 5h14M6 10h8M9 15h2" />
              </svg>
              Filters
              {active.length > 0 && <span className={s.badge}>{active.length}</span>}
            </button>
            <button type="button" className={s.listButton} onClick={() => setOpen('list')}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 5h12M4 10h12M4 15h8" />
              </svg>
              Your list
              {count > 0 && (
                <span className={s.listMeta}>
                  <span className={s.badge}>{count}</span>
                  {listTotal}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className={s.layout}>
          <aside ref={sidebarRef} className={s.sidebar} aria-label="Filters">
            {sidebar}
          </aside>

          <main className={s.main} aria-label="Items">
            <div className={s.resultsBar}>
              <p className={s.count} aria-live="polite">
                {total.toLocaleString('en-IN')} {total === 1 ? 'item' : 'items'}
              </p>
              {active.length > 0 && (
                <ul className={s.activeChips} aria-label="Active filters">
                  {active.map((f) => (
                    <li key={f.id}>
                      <Link href={f.remove} scroll={false} className={s.activeChip}>
                        {f.label}
                        <svg viewBox="0 0 20 20" aria-label={`Remove ${f.label}`}>
                          <path d="M6 6l8 8M14 6l-8 8" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={BASE} scroll={false} className={s.clear}>
                      Clear all
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {total === 0 ? (
              <div className={s.empty}>
                <p>Nothing in stock matches these filters.</p>
                <p className={s.emptyHint}>Try removing a filter, or ask us for a quote on a made-to-order valve.</p>
                <Link href={BASE} className={s.pageButton}>
                  Clear all filters
                </Link>
              </div>
            ) : (
              <ul className={s.grid}>
                {items.map((item) => (
                  <Card key={item.key} item={item} inList={list.find(item.key)} list={list} />
                ))}
              </ul>
            )}

            {pageCount > 1 && (
              <nav className={s.pager} aria-label="Pages">
                {filters.page > 1 ? (
                  <Link href={href({ page: filters.page - 1 })} rel="prev" className={s.pageButton}>
                    Previous page
                  </Link>
                ) : (
                  <span />
                )}
                <span className={s.pageOf}>
                  Page {filters.page} of {pageCount}
                </span>
                {filters.page < pageCount ? (
                  <Link href={href({ page: filters.page + 1 })} rel="next" className={s.pageButton}>
                    Next page
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </main>
        </div>
      </div>

      {/* Phones: the list stays one tap away at the bottom once it has items. */}
      {count > 0 && !open && (
        <div className={s.bar}>
          <span>
            {count} {count === 1 ? 'item' : 'items'}
            {listTotal && <strong> {listTotal}</strong>}
          </span>
          <button type="button" className={s.primarySmall} onClick={() => setOpen('list')}>
            View list
          </button>
        </div>
      )}

      {/* Sheets: the list drawer (right on desktop, bottom on phones) and the phone filter sheet. */}
      {open && <button type="button" className={s.scrim} aria-label="Close" onClick={() => setOpen(null)} />}
      <div
        ref={open === 'list' ? sheetRef : undefined}
        className={s.drawer}
        data-open={open === 'list'}
        role="dialog"
        aria-modal="true"
        aria-label="Your list"
        tabIndex={-1}
      >
        <ListPanel list={list} isSignedIn={isSignedIn} onClose={() => setOpen(null)} />
      </div>
      <div
        ref={open === 'filters' ? sheetRef : undefined}
        className={s.filterSheet}
        data-open={open === 'filters'}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabIndex={-1}
      >
        <div className={s.panelHead}>
          <h2>Filters</h2>
          <button type="button" className={s.iconButton} onClick={() => setOpen(null)} aria-label="Close filters">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className={s.filterSheetBody}>{sidebar}</div>
        <div className={s.filterSheetFoot}>
          <button type="button" className={s.primary} onClick={() => setOpen(null)}>
            Show {total.toLocaleString('en-IN')} {total === 1 ? 'item' : 'items'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Sizes shown before "Show all"; the list is already in bore order. */
const TOP_SIZES = 16;

/**
 * The filter column. Every facet is multi-select: values inside a facet widen
 * the results (OR), facets narrow them (AND). Each option is a link to the
 * toggled URL, so filtering works without JavaScript too.
 */
function FilterSidebar({
  filters,
  options,
  showcase,
  href,
  anyActive,
}: {
  filters: CatalogFilters;
  options: Props['options'];
  showcase: TypeTile[];
  href: (patch: Partial<CatalogFilters>) => string;
  anyActive: boolean;
}) {
  // Most-stocked types and smallest sizes first; the rest are one tap away.
  // Anything already selected always stays visible, even in the folded part.
  const [allTypes, setAllTypes] = useState(false);
  const [allSizes, setAllSizes] = useState(false);
  const types = allTypes ? showcase : showcase.filter((t, i) => i < TOP_TYPES || filters.type.includes(t.type));
  const sizes = allSizes ? options.sizes : options.sizes.filter((v, i) => i < TOP_SIZES || filters.size.includes(v));

  const clear = (k: FacetKey) => (filters[k].length > 0 ? href({ [k]: [] }) : undefined);

  return (
    <div className={s.facets}>
      {anyActive && (
        <Link href={BASE} scroll={false} className={s.clearAll}>
          Clear all filters
        </Link>
      )}

      <Facet title="Valve type" selected={filters.type.length} clearHref={clear('type')}>
        <ul className={s.options}>
          {types.map((t) => (
            <CheckOption
              key={t.type}
              href={href({ type: toggle(filters.type, t.type) })}
              checked={filters.type.includes(t.type)}
              label={displayName(t.type)}
              count={t.count}
            />
          ))}
        </ul>
        {showcase.length > TOP_TYPES && (
          <button type="button" className={s.moreButton} onClick={() => setAllTypes((v) => !v)} aria-expanded={allTypes}>
            {allTypes ? 'Show fewer types' : `Show all ${showcase.length} types`}
          </button>
        )}
      </Facet>

      <Facet title="Size, mm" selected={filters.size.length} clearHref={clear('size')}>
        <ul className={s.sizeGrid}>
          {sizes.map((v) => (
            <ToggleChip key={v} href={href({ size: toggle(filters.size, v) })} checked={filters.size.includes(v)}>
              {bore(v)}
            </ToggleChip>
          ))}
        </ul>
        {options.sizes.length > TOP_SIZES && (
          <button type="button" className={s.moreButton} onClick={() => setAllSizes((v) => !v)} aria-expanded={allSizes}>
            {allSizes ? 'Show fewer sizes' : `Show all ${options.sizes.length} sizes`}
          </button>
        )}
      </Facet>

      <Facet title="Pressure" selected={filters.pn.length} clearHref={clear('pn')}>
        <ul className={s.chips}>
          {options.pns.map((p) => (
            <ToggleChip key={p} href={href({ pn: toggle(filters.pn, p) })} checked={filters.pn.includes(p)}>
              {rating(p)}
            </ToggleChip>
          ))}
        </ul>
      </Facet>

      <Facet title="Material" selected={filters.moc.length} clearHref={clear('moc')}>
        <ul className={s.chips}>
          {options.mocs.map((m) => (
            <ToggleChip key={m} href={href({ moc: toggle(filters.moc, m) })} checked={filters.moc.includes(m)}>
              {m}
            </ToggleChip>
          ))}
        </ul>
      </Facet>
    </div>
  );
}

function Facet({
  title,
  selected,
  clearHref,
  children,
}: {
  title: string;
  selected: number;
  clearHref?: string;
  children: ReactNode;
}) {
  return (
    <section className={s.facet}>
      <div className={s.facetHead}>
        <h2 className={s.facetTitle}>
          {title}
          {selected > 0 && <span className={s.facetCount}>{selected}</span>}
        </h2>
        {clearHref && (
          <Link href={clearHref} scroll={false} className={s.facetClear}>
            Clear
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** Links behave as checkboxes here: Space toggles, like a real checkbox. */
const spaceToggles = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
  if (e.key === ' ') {
    e.preventDefault();
    e.currentTarget.click();
  }
};

function CheckOption({ href, checked, label, count }: { href: string; checked: boolean; label: string; count?: number }) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        className={s.option}
        role="checkbox"
        aria-checked={checked}
        onKeyDown={spaceToggles}
      >
        <span className={s.checkbox} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
        <span className={s.optionLabel}>{label}</span>
        {count != null && <span className={s.optionCount}>{count.toLocaleString('en-IN')}</span>}
      </Link>
    </li>
  );
}

function ToggleChip({ href, checked, children }: { href: string; checked: boolean; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        className={s.chip}
        role="checkbox"
        aria-checked={checked}
        onKeyDown={spaceToggles}
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * One stocked item. The nameplate on the photo carries bore and pressure the way
 * the riveted plate on a real valve does; the rest of the card stays quiet.
 */
function Card({
  item,
  inList,
  list,
}: {
  item: StockItem;
  inList?: ListItem;
  list: ReturnType<typeof useEnquiryList>;
}) {
  const name = displayName(item.title);
  const category = item.category && item.category !== 'TRADING VALVES' ? displayName(item.category) : null;
  return (
    <li className={s.card} data-in-list={Boolean(inList)}>
      <div className={s.photo}>
        {item.image ? <img src={item.image} alt="" loading="lazy" /> : <ValveGlyph />}
        {(item.size || item.pressure) && (
          <span className={s.plate}>
            {item.size && (
              <span>
                {bore(item.size)}
                <small>mm</small>
              </span>
            )}
            {item.pressure && <span>{rating(item.pressure)}</span>}
          </span>
        )}
      </div>

      <div className={s.cardBody}>
        <h3 className={s.cardName}>{name}</h3>
        <p className={s.cardMeta}>
          <span>{item.itemCode}</span>
          {item.moc && <span>{item.moc}</span>}
          {category && <span>{category}</span>}
        </p>

        <div className={s.cardFoot}>
          <p className={s.price}>
            {item.price ?? <span className={s.onRequest}>Price on request</span>}
            {item.price && <span className={s.per}>per {item.unit.toLowerCase() === 'no' ? 'piece' : item.unit.toLowerCase()}</span>}
          </p>
          {inList ? (
            <div className={s.inList}>
              <span>In your list</span>
              <Stepper item={inList} list={list} label={name} />
            </div>
          ) : (
            <button type="button" className={s.add} onClick={() => list.add(item)} aria-label={`Add ${name} to your list`}>
              Add to list
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Stepper({ item, list, label }: { item: ListItem; list: ReturnType<typeof useEnquiryList>; label: string }) {
  const err = qtyError(item.quantity);
  const id = `stock-qty-${item.key}`;
  return (
    <div className={s.stepperWrap}>
      <div className={s.stepper} data-invalid={err !== null}>
        <button type="button" onClick={() => list.step1(item.key, -1)} aria-label={`One less ${label}`}>
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_QTY}
          value={item.quantity}
          onChange={(e) => list.update(item.key, 'quantity', e.target.value)}
          onBlur={(e) => list.update(item.key, 'quantity', clampQty(e.target.value))}
          aria-label={`Quantity of ${label}`}
          aria-invalid={err !== null}
          aria-describedby={err ? `${id}-err` : undefined}
        />
        <button
          type="button"
          onClick={() => list.step1(item.key, 1)}
          disabled={Number(item.quantity) >= MAX_QTY}
          aria-label={`One more ${label}`}
        >
          +
        </button>
      </div>
      {err && (
        <p id={`${id}-err`} className={s.fieldError} role="alert">
          {err}
        </p>
      )}
    </div>
  );
}

function ListPanel({
  list,
  isSignedIn,
  onClose,
}: {
  list: ReturnType<typeof useEnquiryList>;
  isSignedIn: boolean;
  onClose: () => void;
}) {
  const { items, step } = list;
  const total = list.totalPaise != null ? rupees(list.totalPaise / 100) : null;

  const head = (title: string, back?: () => void): ReactNode => (
    <div className={s.panelHead}>
      {back && (
        <button type="button" className={s.iconButton} onClick={back} aria-label="Back to your list">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
      )}
      <h2>{title}</h2>
      <button type="button" className={s.iconButton} onClick={onClose} aria-label="Close list">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </div>
  );

  if (step === 'paid' || step === 'sent') {
    const paid = step === 'paid';
    return (
      <div className={s.panelBody}>
        {head('Your list')}
        <div className={s.result} role="status">
          <span className={s.resultMark} data-kind={paid ? 'paid' : 'sent'} aria-hidden="true">
            <svg viewBox="0 0 24 24">{paid ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M4 12l16-8-6 16-2.5-6.5z" />}</svg>
          </span>
          <h3>{paid ? 'Payment received' : 'Request sent'}</h3>
          <p>
            {paid
              ? "Your order is confirmed. We'll email you and get in touch about despatch."
              : "Our sales team will send you a quote. You can pay from Quotes and orders once it's ready."}
          </p>
          <Link href="/cost" className={s.primary}>
            {paid ? 'View my orders' : 'View my requests'}
          </Link>
          <button type="button" className={s.textButton} onClick={() => list.setStep('list')}>
            Keep browsing
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={s.panelBody}>
        {head('Your list')}
        <p className={s.panelEmpty}>
          Add valves from the catalogue to buy them now or ask us for a quote. Your list is kept on this device.
        </p>
      </div>
    );
  }

  const signIn = (label: string) => (
    <Link href="/login?next=/purchase" className={s.primary}>
      {label}
    </Link>
  );

  if (step === 'quote') {
    return (
      <div className={s.panelBody}>
        {head('Ask for a quote', () => list.setStep('list'))}
        <div className={s.scrollArea}>
        <ul className={s.lines}>
          {items.map((i) => (
            <li key={i.key} className={s.quoteLine}>
              <p className={s.lineName}>{displayName(i.title)}</p>
              <p className={s.lineSpec}>
                {clampQty(i.quantity)} {i.unit.toLowerCase() === 'no' ? 'nos' : i.unit.toLowerCase()}
                {i.size && `, ${bore(i.size)} mm`}
                {i.pressure && `, ${rating(i.pressure)}`}
              </p>
              <label className={s.smallLabel} htmlFor={`stock-rem-${i.key}`}>
                Note for this item
              </label>
              <input
                id={`stock-rem-${i.key}`}
                className={s.input}
                value={i.remarks}
                maxLength={MAX_REMARKS}
                onChange={(e) => list.update(i.key, 'remarks', e.target.value)}
                placeholder="Optional, e.g. with test certificate"
              />
            </li>
          ))}
        </ul>
        <label className={s.smallLabel} htmlFor="stock-notes">
          Delivery and other requirements
        </label>
        <textarea
          id="stock-notes"
          className={s.input}
          rows={3}
          maxLength={MAX_NOTES}
          value={list.notes}
          onChange={(e) => list.setNotes(e.target.value)}
          placeholder="Optional: delivery site, required date, inspection needs"
        />
        </div>
        <div className={s.panelFoot}>
          {list.error && (
            <p className={s.formError} role="alert">
              {list.error}
            </p>
          )}
          {isSignedIn ? (
            <button
              type="button"
              className={s.primary}
              onClick={list.sendQuote}
              disabled={list.busy !== null || list.hasInvalidQty}
            >
              {list.busy === 'quote' ? 'Sending…' : 'Send quote request'}
            </button>
          ) : (
            signIn('Sign in to send the request')
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={s.panelBody}>
      {head(`Your list (${items.length})`)}
      <ul className={`${s.lines} ${s.scrollArea}`}>
        {items.map((i) => {
          const name = displayName(i.title);
          return (
            <li key={i.key} className={s.line}>
              <div className={s.lineText}>
                <p className={s.lineName}>{name}</p>
                <p className={s.lineSpec}>
                  {[i.size && `${bore(i.size)} mm`, i.pressure && rating(i.pressure)].filter(Boolean).join(', ') ||
                    i.itemCode}
                </p>
              </div>
              <button type="button" className={s.remove} onClick={() => list.remove(i.key)} aria-label={`Remove ${name}`}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
              <Stepper item={i} list={list} label={name} />
              <span className={s.linePrice}>
                {i.unitPrice != null && qtyError(i.quantity) === null
                  ? rupees(i.unitPrice * Number(i.quantity))
                  : 'On request'}
              </span>
            </li>
          );
        })}
      </ul>

      <div className={s.panelFoot}>
        {total && (
          <p className={s.total}>
            <span>Total</span>
            <strong>{total}</strong>
          </p>
        )}
        <p className={s.rule}>
          {list.buyable
            ? 'Under ₹20 lakh, so you can pay online now.'
            : total
              ? 'Orders of ₹20 lakh and above are quoted by our sales team.'
              : 'Some items are priced on request, so we will quote this list.'}
        </p>
        {list.error && (
          <p className={s.formError} role="alert">
            {list.error}
          </p>
        )}
        {list.buyable ? (
          <>
            {isSignedIn ? (
              <button
                type="button"
                className={s.primary}
                onClick={list.buyNow}
                disabled={list.busy !== null || list.hasInvalidQty}
              >
                {list.busy === 'buy' ? 'Opening payment…' : `Buy now, ${total}`}
              </button>
            ) : (
              signIn('Sign in to buy')
            )}
            <button
              type="button"
              className={s.textButton}
              onClick={() => list.setStep('quote')}
              disabled={list.hasInvalidQty}
            >
              Ask for a formal quote instead
            </button>
          </>
        ) : (
          <button
            type="button"
            className={s.primary}
            onClick={() => list.setStep('quote')}
            disabled={list.hasInvalidQty}
          >
            Ask for a quote
          </button>
        )}
      </div>
    </div>
  );
}
