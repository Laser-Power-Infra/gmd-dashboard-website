import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ENGINEERING_TABS } from "./tableConfig";
import { fetchEngineeringSheet } from "./googleSheets";
import { rowToRecord } from "./engineeringModels";

/**
 * Sheet -> Postgres sync for the Engineering Data tables.
 *
 * Server-only. Called by `POST /api/engineering-data/sync`; the UI reads the
 * result back through `lib/gmd/engineeringData.ts`.
 *
 * Each tab is fully replaced (`deleteMany` + `createMany` inside a transaction)
 * rather than upserted. None of these sheets has a reliable natural key — the
 * same size/rating legitimately repeats many times — so a partial upsert would
 * silently duplicate rows. A full replace is idempotent and cheap at ~630 rows.
 *
 * A failure on one tab is reported per-tab instead of aborting the whole run,
 * so one mis-typed sheet header cannot block the other four from updating.
 */

export type TabSyncResult =
  | { tabKey: string; ok: true; totalRows: number; syncedAt: string }
  | { tabKey: string; ok: false; error: string };

/**
 * Replaces the stored rows for one tab. The casts are the one place the
 * positional sheet values meet Prisma's generated per-model inputs; every field
 * on every model is `String?` (plus `rowIndex`), which is what makes a single
 * generic path safe here.
 */
async function replaceTab(
  tabKey: string,
  records: Record<string, string | number>[],
): Promise<void> {
  switch (tabKey) {
    case "gate-valve": {
      const data = records as unknown as Prisma.GateValveCreateManyInput[];
      await prisma.$transaction([
        prisma.gateValve.deleteMany(),
        prisma.gateValve.createMany({ data }),
      ]);
      return;
    }
    case "flange": {
      const data = records as unknown as Prisma.FlangeCreateManyInput[];
      await prisma.$transaction([
        prisma.flange.deleteMany(),
        prisma.flange.createMany({ data }),
      ]);
      return;
    }
    case "gear-box": {
      const data = records as unknown as Prisma.GearBoxCreateManyInput[];
      await prisma.$transaction([
        prisma.gearBox.deleteMany(),
        prisma.gearBox.createMany({ data }),
      ]);
      return;
    }
    case "actuator": {
      const data = records as unknown as Prisma.ActuatorCreateManyInput[];
      await prisma.$transaction([
        prisma.actuator.deleteMany(),
        prisma.actuator.createMany({ data }),
      ]);
      return;
    }
    case "density": {
      const data = records as unknown as Prisma.DensityCreateManyInput[];
      await prisma.$transaction([
        prisma.density.deleteMany(),
        // `material` is unique; skipDuplicates keeps a repeated material in the
        // sheet from failing the whole sync.
        prisma.density.createMany({ data, skipDuplicates: true }),
      ]);
      return;
    }
    default:
      throw new Error(`Unknown engineering tab: ${tabKey}`);
  }
}

/** Dedupe guard so two quick clicks cannot run concurrent syncs. */
let inFlight: Promise<TabSyncResult[]> | null = null;
let lastSyncAt = 0;

/** Epoch ms of the last completed sync, or 0 if none this process. */
export function getLastSyncAt(): number {
  return lastSyncAt;
}

export async function syncAllEngineeringTabs(): Promise<TabSyncResult[]> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const results: TabSyncResult[] = [];

    for (const tab of ENGINEERING_TABS) {
      try {
        const { rows } = await fetchEngineeringSheet(tab);
        const records = rows.map((row, index) => ({
          rowIndex: index,
          ...rowToRecord(tab.key, row),
        }));

        await replaceTab(tab.key, records);

        const syncedAt = new Date();
        await prisma.engineeringSync.upsert({
          where: { tabKey: tab.key },
          create: { tabKey: tab.key, syncedAt, totalRows: records.length },
          update: { syncedAt, totalRows: records.length },
        });

        results.push({
          tabKey: tab.key,
          ok: true,
          totalRows: records.length,
          syncedAt: syncedAt.toISOString(),
        });
      } catch (err) {
        results.push({
          tabKey: tab.key,
          ok: false,
          error: err instanceof Error ? err.message : "Sync failed.",
        });
      }
    }

    return results;
  })();

  try {
    return await inFlight;
  } finally {
    lastSyncAt = Date.now();
    inFlight = null;
  }
}
