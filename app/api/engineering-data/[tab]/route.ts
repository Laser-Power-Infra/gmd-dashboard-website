import { ENGINEERING_TABS, findTab } from "@/lib/gmd/tableConfig";
import { getEngineeringTab } from "@/lib/gmd/engineeringData";

/**
 * GET /api/engineering-data/[tab]
 *
 * Serves one table **from Postgres** — this route never talks to Google. Use
 * `POST /api/engineering-data/sync` to refresh the database from the sheet.
 *
 * Returns `{ headers, rows, ids, syncedAt, totalRows, synced }`. A tab that has
 * never been synced returns `200` with `rows: []` and `synced: false`, which the
 * UI renders as a "not synced yet" prompt rather than an empty table.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tab: string }> },
) {
  const { tab: tabKey } = await params;

  const tab = findTab(tabKey);
  if (!tab) {
    return Response.json(
      {
        error: "Unknown tab",
        knownTabs: ENGINEERING_TABS.map((t) => t.key),
      },
      { status: 404 },
    );
  }

  try {
    const data = await getEngineeringTab(tab);
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to read from the database.";
    console.error(`[engineering-data] read ${tabKey}:`, err);
    return Response.json({ error: message }, { status: 500 });
  }
}
