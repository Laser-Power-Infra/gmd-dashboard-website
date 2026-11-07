import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { applyLookupSync } from "@/lib/lookupSync";

/**
 * POST /api/lookup-options/sync
 *
 * Receives LookupOption changes from gmd-quotation so both tables stay
 * identical (matched by id). Gated by the `x-api-key` header, which must equal
 * LOOKUP_SYNC_API_KEY.
 *
 *   body: { upsert: LookupRow[], delete: string[] }
 *   200 { ok, upserted, deleted } | 400 bad body | 401 bad key | 503 key unset
 */
export const dynamic = "force-dynamic";

const schema = z.object({
  upsert: z
    .array(
      z.object({
        id: z.string().min(1),
        type: z.string(),
        value: z.string(),
        sortOrder: z.number().int(),
        isActive: z.boolean(),
        code: z.string().nullable(),
        defaultState: z.string().nullable(),
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
      }),
    )
    .max(2000),
  delete: z.array(z.string()).max(2000),
});

export async function POST(request: Request) {
  const expected = process.env.LOOKUP_SYNC_API_KEY;
  if (!expected) {
    return Response.json({ error: "Sync not configured" }, { status: 503 });
  }
  const a = Buffer.from(request.headers.get("x-api-key") ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const result = await applyLookupSync(parsed.data);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error("lookup-options sync failed", e);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
