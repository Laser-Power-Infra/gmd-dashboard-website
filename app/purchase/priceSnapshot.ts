/**
 * Pure matching for the hourly price push from gmd-quotation (RawMaterial.cost,
 * keyed by erpItemCode). No database, no server-only imports, so
 * scripts/check-purchase-catalog.mjs can test it directly.
 */

export type CostEntry = { erpItemCode: string; cost: number | null };
export type PriceRow = { id: string; itemCode: string; price: number | null };

/** The quotation app stores codes as typed; compare trimmed and upper-cased. */
export const normalizeCode = (code: string) => code.trim().toUpperCase();

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Snapshot -> the price each catalogue row should have.
 * A positive cost becomes the price, rounded to paise. Everything else - cost 0
 * or empty, or a code not in the snapshot - becomes null ("Price on request"),
 * because the push is a full snapshot: absent means not priced there.
 * Rows sharing an item code (same code, different spec) get the same price.
 * Returns only the rows whose price actually changes.
 */
export function planPriceUpdates(rows: PriceRow[], snapshot: CostEntry[]) {
  const costByCode = new Map<string, number | null>();
  for (const e of snapshot) costByCode.set(normalizeCode(e.erpItemCode), e.cost);

  const updates: { id: string; price: number | null }[] = [];
  let priced = 0;
  for (const row of rows) {
    const cost = costByCode.get(normalizeCode(row.itemCode));
    const price = cost != null && Number.isFinite(cost) && cost > 0 ? round2(cost) : null;
    if (price !== null) priced++;
    if (price !== row.price) updates.push({ id: row.id, price });
  }
  return { updates, priced, onRequest: rows.length - priced };
}
