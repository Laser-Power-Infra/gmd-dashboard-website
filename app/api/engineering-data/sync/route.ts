import {
  syncAllEngineeringTabs,
  getLastSyncAt,
} from "@/lib/gmd/syncEngineering";

/**
 * POST /api/engineering-data/sync
 *
 * Pulls all five tabs from the Google Sheet and rewrites their rows in
 * Postgres. This is the only endpoint that touches Google; the read API serves
 * the UI purely from the database.
 *
 * Deliberately ungated, per the requirement for a plain "Sync from Sheet"
 * button. The blast radius is bounded by:
 *   - a 60s cooldown (see below), so a burst of requests cannot hammer the
 *     Sheets API or the database;
 *   - `syncAllEngineeringTabs`'s in-flight guard, so concurrent clicks share
 *     one run rather than stacking.
 * `?force=1` bypasses the cooldown. If this should be admin-only, wrap it in a
 * session/role check — the sync itself does not care.
 */
export const dynamic = "force-dynamic";

const COOLDOWN_MS = 60_000;

export async function POST(request: Request) {
  const force = new URL(request.url).searchParams.get("force") === "1";

  if (!force) {
    const since = Date.now() - getLastSyncAt();
    if (getLastSyncAt() > 0 && since < COOLDOWN_MS) {
      return Response.json(
        {
          error: "Sync was run less than a minute ago. Try again shortly.",
          retryAfterMs: COOLDOWN_MS - since,
        },
        { status: 429 },
      );
    }
  }

  try {
    const results = await syncAllEngineeringTabs();
    const failed = results.filter((r) => !r.ok);

    return Response.json(
      {
        ok: failed.length === 0,
        results,
      },
      // 207 when some tabs succeeded and some failed, so the caller sees partial
      // success rather than a blanket error.
      { status: failed.length === 0 ? 200 : 207 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "The sync could not be started.";
    console.error("[engineering-data] sync:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
