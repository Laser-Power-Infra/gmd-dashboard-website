import { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

export type LookupRow = {
  id: string;
  type: string;
  value: string;
  sortOrder: number;
  isActive: boolean;
  code: string | null;
  defaultState: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const CHUNK = 200;

// timestamp(3) columns hold UTC wall-clock time.
const ts = (d: string | Date) =>
  Prisma.sql`(${new Date(d).toISOString()}::timestamptz AT TIME ZONE 'UTC')`;

/** Mirror rows from gmd-quotation, matched by id. Idempotent. */
export async function applyLookupSync({
  upsert,
  delete: ids,
}: {
  upsert: LookupRow[];
  delete: string[];
}) {
  if (ids.length) {
    await prisma.lookupOption.deleteMany({ where: { id: { in: ids } } });
  }
  // Last row wins per (type,value), so one chunk can't clash with itself.
  const rows = [...new Map(upsert.map((r) => [`${r.type}\0${r.value}`, r])).values()];
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    // Free (type,value) / code slots held by other ids, then upsert in one INSERT.
    const clash = [
      ...chunk.map((r) => ({ type: r.type, value: r.value })),
      ...chunk.filter((r) => r.code).map((r) => ({ code: r.code })),
    ];
    const values = chunk.map(
      (r) =>
        Prisma.sql`(${r.id}, ${r.type}, ${r.value}, ${r.sortOrder}, ${r.isActive}, ${r.code}, ${r.defaultState}, ${ts(r.createdAt)}, ${ts(r.updatedAt)})`,
    );
    await prisma.$transaction([
      prisma.lookupOption.deleteMany({
        where: { id: { notIn: chunk.map((r) => r.id) }, OR: clash },
      }),
      prisma.$executeRaw`INSERT INTO "LookupOption" ("id","type","value","sortOrder","isActive","code","defaultState","createdAt","updatedAt")
        VALUES ${Prisma.join(values)}
        ON CONFLICT ("id") DO UPDATE SET "type" = EXCLUDED."type", "value" = EXCLUDED."value",
          "sortOrder" = EXCLUDED."sortOrder", "isActive" = EXCLUDED."isActive", "code" = EXCLUDED."code",
          "defaultState" = EXCLUDED."defaultState", "createdAt" = EXCLUDED."createdAt", "updatedAt" = EXCLUDED."updatedAt"`,
    ]);
  }
  return { upserted: rows.length, deleted: ids.length };
}
