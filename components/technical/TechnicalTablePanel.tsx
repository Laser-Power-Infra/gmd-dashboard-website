"use client";

import { useEffect, useState } from "react";
import { RefreshCw, DatabaseZap } from "lucide-react";

import GMDUpdateTable from "./GMDUpdateTable";
import GMDUpdateHeader from "./GMDUpdateHeader";
import DensityInline from "./DensityInline";
import ErrorState from "./ErrorState";
import Skeleton from "./Skeleton";
import type {
  DensityPair,
  EngineeringDataState,
  EngineeringTableData,
  EngineeringTab,
} from "@/lib/gmd/types";

/**
 * One subtab: the title bar, a loading/error/"not synced" branch, and the table.
 *
 * Reads from `/api/engineering-data/<key>`, which is served from Postgres. The
 * parent gives this component `key={tab.key}`, so switching tabs remounts it and
 * the initial `loading` state is never assigned inside an effect.
 *
 * `dataNonce` is bumped by the parent after a successful sheet sync; it re-runs
 * the fetch without remounting, so the visible tab refreshes in place.
 * `reloadNonce` does the same for the local Refresh button (a plain DB re-read).
 */
export default function TechnicalTablePanel({
  tab,
  dataNonce = 0,
  densityPairs = [],
}: {
  tab: EngineeringTab;
  dataNonce?: number;
  densityPairs?: DensityPair[];
}) {
  const [state, setState] = useState<EngineeringDataState>({ status: "loading" });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // `?refresh` is a cache-buster; the read route is already `no-store`.
    const url = `/api/engineering-data/${tab.key}?r=${dataNonce}-${reloadNonce}`;

    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then(async (res) => {
        const body = (await res.json().catch(() => null)) as
          | (EngineeringTableData & { error?: string })
          | null;
        if (!res.ok) {
          throw new Error(
            body?.error ?? `Request failed with status ${res.status}.`,
          );
        }
        if (!body) throw new Error("The server returned an empty response.");
        return body;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Failed to load this table from the database.",
        });
      });

    return () => controller.abort();
  }, [tab.key, dataNonce, reloadNonce]);

  const refreshButton = (
    <button
      type="button"
      onClick={() => setReloadNonce((n) => n + 1)}
      disabled={state.status === "loading"}
      className="flex items-center gap-1.5 rounded border border-white/25 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
      title="Re-read this table from the database"
    >
      <RefreshCw size={12} />
      Refresh
    </button>
  );

  return (
    <div
      className="flex flex-col"
      role="tabpanel"
      id={`panel-${tab.key}`}
      aria-labelledby={`tab-${tab.key}`}
    >
      {state.status === "error" ? (
        <>
          <GMDUpdateHeader title={tab.label} totalRows={0} />
          <ErrorState
            message={state.message}
            onRetry={() => setReloadNonce((n) => n + 1)}
          />
        </>
      ) : state.status === "loading" ? (
        <>
          <GMDUpdateHeader title={tab.label} totalRows={0} />
          <div className="flex flex-col gap-2 rounded-b-lg border border-t-0 border-line bg-white p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        </>
      ) : !state.data.synced ? (
        <>
          <GMDUpdateHeader title={tab.label} totalRows={0} />
          <div className="flex flex-col items-center gap-3 rounded-b-lg border border-t-0 border-line bg-white px-6 py-16 text-center">
            <DatabaseZap size={30} className="text-primary" />
            <h3 className="text-base font-semibold text-ink">
              This table has not been synced yet
            </h3>
            <p className="max-w-md text-sm text-ink-muted">
              Press <strong>Sync from Sheet</strong> above to copy the latest
              values into the database. After that this table will load
              instantly, without contacting Google.
            </p>
          </div>
        </>
      ) : (
        <>
          <GMDUpdateHeader
            title={tab.label}
            totalRows={state.data.totalRows}
            syncedAt={state.data.syncedAt}
            actions={refreshButton}
          />
          {/* <p className="border-x border-b border-line bg-surface-soft px-6 py-2.5 text-[13px] text-ink-muted">
            {tab.description}
          </p> */}
          <GMDUpdateTable
            headers={state.data.headers}
            rows={state.data.rows}
            ids={state.data.ids}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            statusColumns={tab.statusColumns}
            numericColumns={tab.numericColumns}
            defaultColumnWidths={tab.defaultColumnWidths}
            wrapCells={tab.wrapCells}
            maxHeight="70vh"
            toolbarExtra={<DensityInline pairs={densityPairs} />}
          />
        </>
      )}
    </div>
  );
}
