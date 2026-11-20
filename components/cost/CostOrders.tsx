import { displayName } from '@/app/purchase/catalog';
import PayButton from '@/components/cost/PayButton';
import { canPayOnline, formatRupees } from '@/lib/razorpay';
import type { CostItem, PurchaseLine } from '@/lib/schemas/cost';
import s from './cost.module.css';

export type OrderRow = {
  id: string;
  status: string;
  items: unknown;
  quotedAmount: number | null;
  createdAt: Date;
  paidAt: Date | null;
};

const day = (d: Date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
const dayShort = (d: Date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(d);
const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const isPurchaseLine = (i: unknown): i is PurchaseLine => typeof i === 'object' && i !== null && 'itemCode' in i;
const isCostItem = (i: unknown): i is CostItem => typeof i === 'object' && i !== null && 'valveType' in i;

/** A line's readable name: catalogue lines are sentence-cased, estimate lines are built from their spec. */
function lineName(i: unknown): string {
  if (isPurchaseLine(i)) return displayName(i.itemName);
  if (isCostItem(i)) return displayName(`${i.valveType} ${i.size} ${i.pressure}`);
  return 'Item';
}

/** What happens next, in the buyer's words - not the database status. */
function stage(row: OrderRow): { label: string; tone: 'wait' | 'act' | 'done' | 'off' } {
  switch (row.status) {
    case 'NEW':
      return { label: 'Waiting for quote', tone: 'wait' };
    case 'CONTACTED':
      return { label: 'In discussion', tone: 'wait' };
    case 'QUOTED':
      return canPayOnline(row.quotedAmount)
        ? { label: 'Ready to pay', tone: 'act' }
        : { label: 'Quotation sent by email', tone: 'wait' };
    case 'PAID':
      return { label: 'Paid', tone: 'done' };
    default:
      return { label: 'Closed', tone: 'off' };
  }
}

export default function CostOrders({ rows }: { rows: OrderRow[] }) {
  if (rows.length === 0) {
    return (
      <div className={s.emptyOrders}>
        <p>No orders or requests yet.</p>
        <p>Buy ready stock from the catalogue, or ask us to estimate a made-to-order valve.</p>
      </div>
    );
  }

  return (
    <ul className={s.orders}>
      {rows.map((row) => {
        const items = Array.isArray(row.items) ? row.items : [];
        // Summary keeps only the head of the name ("Sluice valve 40 mm PN 25") so "and N more" stays visible.
        const first = items.length ? lineName(items[0]).split(',')[0] : 'Empty request';
        const more = items.length - 1;
        const st = stage(row);
        const payable = row.status === 'QUOTED' && canPayOnline(row.quotedAmount);

        return (
          <li key={row.id} className={s.order}>
            <div className={s.orderMain}>
              <div className={s.when}>
                <span>{day(row.createdAt)}</span>
                <span className={s.ref}>Ref {row.id.slice(-6).toUpperCase()}</span>
              </div>

              <p className={s.summary}>
                {first}
                {more > 0 && <span className={s.more}> and {more} more</span>}
              </p>

              <p className={s.amount}>{row.quotedAmount ? formatRupees(row.quotedAmount) : <span>To be quoted</span>}</p>

              <div className={s.next}>
                <span className={s.stage} data-tone={st.tone}>
                  {st.label}
                  {row.status === 'PAID' && row.paidAt && ` ${dayShort(row.paidAt)}`}
                </span>
                {payable && <PayButton costRequestId={row.id} amountPaise={row.quotedAmount!} className={s.pay} />}
              </div>
            </div>

            <details className={s.details}>
              <summary>
                {items.length === 1 ? 'View item' : `View ${items.length} items`}
              </summary>
              <ul className={s.lines}>
                {items.map((i, n) => (
                  <li key={n} className={s.line}>
                    <div>
                      <p className={s.lineName}>{lineName(i)}</p>
                      <p className={s.lineMeta}>
                        {isPurchaseLine(i) && <span>{i.itemCode}</span>}
                        {isCostItem(i) && (
                          <span>
                            {i.material}, {i.endConnection}
                          </span>
                        )}
                        {(isPurchaseLine(i) || isCostItem(i)) && <span>Quantity {i.quantity}</span>}
                        {(isPurchaseLine(i) || isCostItem(i)) && i.remarks && <span>{i.remarks}</span>}
                      </p>
                    </div>
                    <p className={s.linePrice}>
                      {isPurchaseLine(i) && i.unitPrice != null ? (
                        <>
                          {rupees(i.unitPrice * i.quantity)}
                          {i.quantity > 1 && <small>{rupees(i.unitPrice)} each</small>}
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
