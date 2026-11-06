import { prisma } from "@/lib/prisma";
import { ENGINEERING_TABS, findTab } from "./tableConfig";
import { fetchEngineeringSheet } from "./googleSheets";
import { rowToRecord, sheetFieldCount, TAB_FIELDS } from "./engineeringModels";
import type { EngineeringTab } from "./types";

/**
 * Sheet -> Postgres sync for the Engineering Data tables.
 *
 * Server-only. Called by `POST /api/engineering-data/sync`; the UI reads the
 * result back through `lib/gmd/engineeringData.ts`.
 *
 * **Non-destructive by design**, mirroring the original GMD sync routes
 * (`gmd-quotation-process/app/api/bom|supply-history/sync`):
 *
 *   - No `deleteMany`. Rows are matched and updated in place; new rows are
 *     inserted. A row that disappears from the sheet is left alone.
 *   - A blank (or dash-sentinel) sheet cell never overwrites a stored value.
 *   - App-managed columns (past a tab's `sheetColumnCount`) are never read from
 *     the sheet and never written, so DB/UI-edited values survive every sync.
 *
 * **Row identity is `rowIndex`** (the sheet's row position), not a business key:
 * these sheets have no viable column key — FLANGE has 8 byte-identical rows and
 * GATE VALVE's best key still collides 32 times. The trade-off is that
 * inserting or re-sorting rows in the sheet shifts positions.
 *
 * A failure on one tab is reported per-tab instead of aborting the whole run.
 */

export type TabSyncResult =
  | { tabKey: string; ok: true; totalRows: number; syncedAt: string }
  | { tabKey: string; ok: false; error: string };

/** Guard key for a whole-workbook sync (the `?tab=`-less request). */
const ALL_TABS_KEY = "__all__";

const UPDATE_CHUNK = 200;
const TOUCH_CHUNK = 500;

/**
 * A cell the sync treats as "no information". A standalone dash is the sheet's
 * own "none" marker, so it is skipped rather than stored over a real value.
 */
function isBlankSheetValue(value: unknown): boolean {
  if (value == null) return true;
  const t = String(value).trim();
  return t === "" || t === "-" || t === "--" || t === "—" || t === "–";
}

/**
 * Structural view of a Prisma model delegate, so one code path serves all five
 * tabs. The concrete delegates are structurally compatible; the single cast
 * below is the only place that has to know it.
 */
type TabDelegate = {
  findMany(args: {
    select: Record<string, true>;
  }): Promise<Record<string, unknown>[]>;
  createMany(args: {
    data: Record<string, unknown>[];
  }): Promise<{ count: number }>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
  }): Promise<unknown>;
  updateMany(args: {
    where: { id: { in: string[] } };
    data: Record<string, unknown>;
  }): Promise<{ count: number }>;
};

function delegateFor(tabKey: string): TabDelegate {
  switch (tabKey) {
    case "gate-valve":
      return prisma.gateValve as unknown as TabDelegate;
    case "flange":
      return prisma.flange as unknown as TabDelegate;
    case "gear-box":
      return prisma.gearBox as unknown as TabDelegate;
    case "actuator":
      return prisma.actuator as unknown as TabDelegate;
    case "density":
      return prisma.density as unknown as TabDelegate;
    default:
      throw new Error(`Unknown engineering tab: ${tabKey}`);
  }
}

/** Reads the sheet and reconciles it into the tab's table. Throws on failure. */
async function syncOneTab(tab: EngineeringTab): Promise<TabSyncResult> {
  try {
    const delegate = delegateFor(tab.key);
    const fieldCount = sheetFieldCount(tab.key);
    const sheetFields = TAB_FIELDS[tab.key].slice(0, fieldCount);

    const { rows } = await fetchEngineeringSheet(tab);

    // Preload existing rows keyed by position — one query, no N+1.
    const select: Record<string, true> = { id: true, rowIndex: true };
    for (const field of sheetFields) select[field] = true;
    const existing = await delegate.findMany({ select });
    const byIndex = new Map<number, Record<string, unknown>>();
    for (const row of existing) byIndex.set(Number(row.rowIndex), row);

    const syncedAt = new Date();
    const toCreate: Record<string, unknown>[] = [];
    const toUpdate: { id: string; data: Record<string, unknown> }[] = [];
    const toTouch: string[] = [];

    rows.forEach((row, index) => {
      const incoming = rowToRecord(tab.key, row);
      const db = byIndex.get(index);

      if (!db) {
        // Brand-new position: write the sheet-backed columns; app-managed ones
        // simply stay NULL.
        toCreate.push({ rowIndex: index, ...incoming, syncedAt });
        return;
      }

      const data: Record<string, unknown> = {};
      let changed = false;
      for (const field of sheetFields) {
        const sheetVal = incoming[field];
        // GMD rule: a blank sheet cell never erases a stored value.
        if (isBlankSheetValue(sheetVal)) continue;

        const dbVal = db[field];
        const dbStr = dbVal == null ? "" : String(dbVal).trim();
        const sheetStr = String(sheetVal).trim();
        if (dbStr !== sheetStr) {
          data[field] = sheetVal;
          changed = true;
        }
      }

      const id = String(db.id);
      if (changed) {
        data.syncedAt = syncedAt;
        toUpdate.push({ id, data });
      } else {
        toTouch.push(id);
      }
    });

    if (toCreate.length) {
      await delegate.createMany({ data: toCreate });
    }

    for (let i = 0; i < toUpdate.length; i += UPDATE_CHUNK) {
      const chunk = toUpdate.slice(i, i + UPDATE_CHUNK);
      const settled = await Promise.allSettled(
        chunk.map((u) => delegate.update({ where: { id: u.id }, data: u.data })),
      );
      const failed = settled.filter((s) => s.status === "rejected").length;
      if (failed > 0) {
        throw new Error(`${failed} row update(s) failed for "${tab.key}".`);
      }
    }

    for (let i = 0; i < toTouch.length; i += TOUCH_CHUNK) {
      const chunk = toTouch.slice(i, i + TOUCH_CHUNK);
      await delegate.updateMany({
        where: { id: { in: chunk } },
        data: { syncedAt },
      });
    }

    const totalRows = byIndex.size + toCreate.length;
    await prisma.engineeringSync.upsert({
      where: { tabKey: tab.key },
      create: { tabKey: tab.key, syncedAt, totalRows },
      update: { syncedAt, totalRows },
    });

    return {
      tabKey: tab.key,
      ok: true,
      totalRows,
      syncedAt: syncedAt.toISOString(),
    };
  } catch (err) {
    return {
      tabKey: tab.key,
      ok: false,
      error: err instanceof Error ? err.message : "Sync failed.",
    };
  }
}

/**
 * Dedupe guard and last-run clock, keyed by guard key (a tab key, or
 * `ALL_TABS_KEY`). Per-tab keys are what let the header Sync button work on one
 * table without the cooldown of a *different* table blocking it — and what stop
 * two quick clicks on the same tab from stacking.
 */
const inFlight = new Map<string, Promise<TabSyncResult[]>>();
const lastSyncAt = new Map<string, number>();

/**
 * Epoch ms of the last completed sync for a tab, or of the last whole-workbook
 * sync when `tabKey` is omitted. `0` means no sync this process.
 */
export function getLastSyncAt(tabKey?: string): number {
  return lastSyncAt.get(tabKey ?? ALL_TABS_KEY) ?? 0;
}

async function syncTabs(
  tabs: EngineeringTab[],
  guardKey: string,
): Promise<TabSyncResult[]> {
  const existing = inFlight.get(guardKey);
  if (existing) return existing;

  const run = (async () => {
    const results: TabSyncResult[] = [];
    for (const tab of tabs) {
      results.push(await syncOneTab(tab));
    }
    return results;
  })();

  inFlight.set(guardKey, run);

  try {
    return await run;
  } finally {
    const now = Date.now();
    lastSyncAt.set(guardKey, now);
    // A whole-workbook sync also counts as a sync of each tab it covered, so a
    // per-tab request right afterwards still respects the cooldown.
    for (const tab of tabs) lastSyncAt.set(tab.key, now);
    inFlight.delete(guardKey);
  }
}

/**
 * Syncs a single tab. Throws if the key is unknown.
 *
 * DENSITY is hidden from the subtab bar and so has no Sync button of its own.
 * It is refreshed alongside every tab sync (the requested tab first, so
 * `results[0]` is always the tab the caller asked for) so the inline density
 * reference strip stays populated without a dedicated control.
 */
export async function syncEngineeringTab(
  tabKey: string,
): Promise<TabSyncResult[]> {
  const tab = findTab(tabKey);
  if (!tab) throw new Error(`Unknown engineering tab: ${tabKey}`);

  const density = findTab("density");
  const tabs =
    tab.key === "density" || !density ? [tab] : [tab, density];

  return syncTabs(tabs, tab.key);
}

/** Syncs all tabs. */
export async function syncAllEngineeringTabs(): Promise<TabSyncResult[]> {
  return syncTabs(ENGINEERING_TABS, ALL_TABS_KEY);
}
