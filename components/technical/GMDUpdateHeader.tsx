import { type ReactNode } from "react";

interface GMDUpdateHeaderProps {
  totalRows: number;
  syncedAt?: string | null;
  title?: string;
  actions?: ReactNode;
}

function formatSyncTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Unknown";
  }
}

/**
 * Navy bar above a table: title, row count, last-synced time.
 *
 * `syncedAt` is optional and the whole "Last synced" readout is hidden when it
 * is `undefined` (not merely null) — Phase 1 has no sheet behind it yet, and an
 * "Never" that can never improve is worse than no readout. Pass `null` once a
 * real sync timestamp is wired up in Phase 2.
 */
export default function GMDUpdateHeader({
  totalRows,
  syncedAt,
  title = "GMD UPDATE",
  actions,
}: GMDUpdateHeaderProps) {
  return (
    <div className="bg-primary px-6 py-3 border-b border-primary-dark flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </h2>
        <span className="bg-primary-dark text-white text-[11px] font-semibold px-3 py-1 rounded-full">
          {totalRows.toLocaleString("en-IN")} items
        </span>
        {syncedAt !== undefined && (
          <span className="text-[11px] text-white/70 font-medium">
            Last synced: {formatSyncTime(syncedAt)}
          </span>
        )}
      </div>
      {actions}
    </div>
  );
}
