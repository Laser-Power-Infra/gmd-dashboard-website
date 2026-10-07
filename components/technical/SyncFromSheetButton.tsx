"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

type SyncResult =
  | { tabKey: string; ok: true; totalRows: number; syncedAt: string }
  | { tabKey: string; ok: false; error: string };

/**
 * "Sync from Sheet" — pulls all five tabs from Google into Postgres, then asks
 * the page to re-read the visible tab.
 *
 * The endpoint is intentionally ungated (a plain button was requested), so this
 * handles the cooldown response (429) and per-tab partial failures (207)
 * gracefully rather than presenting them as a hard error.
 */
export default function SyncFromSheetButton({
  onSynced,
}: {
  onSynced?: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const handleSync = async () => {
    setBusy(true);
    const toastId = toast.loading("Syncing from sheet…");
    try {
      const res = await fetch("/api/engineering-data/sync", { method: "POST" });
      const body = (await res.json().catch(() => null)) as
        | { error?: string; results?: SyncResult[] }
        | null;

      if (!res.ok && res.status !== 207) {
        throw new Error(body?.error ?? `Sync failed (${res.status}).`);
      }

      const results = body?.results ?? [];
      const ok = results.filter((r) => r.ok);
      const failed = results.filter((r) => !r.ok) as Extract<
        SyncResult,
        { ok: false }
      >[];

      if (failed.length > 0) {
        toast.warning(
          `Synced ${ok.length} of ${results.length} tables. ${failed
            .map((f) => f.tabKey)
            .join(", ")} failed.`,
          { id: toastId },
        );
        console.error("[sync] failed tabs:", failed);
      } else {
        const total = ok.reduce(
          (sum, r) => sum + (r.ok ? r.totalRows : 0),
          0,
        );
        toast.success(
          `Synced ${ok.length} tables (${total.toLocaleString("en-IN")} rows).`,
          { id: toastId },
        );
      }

      // Refresh the visible tab even on partial failure — some tabs did update.
      onSynced?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not sync from the sheet.",
        { id: toastId },
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={busy}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      title="Pull the latest values from the Google Sheet into the database"
    >
      {busy ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <RefreshCw size={15} />
      )}
      {busy ? "Syncing…" : "Sync from Sheet"}
    </button>
  );
}
