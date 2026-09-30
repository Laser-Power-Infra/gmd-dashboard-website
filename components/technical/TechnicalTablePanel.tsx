"use client";

import { useMemo, useState } from "react";

import GMDUpdateTable from "./GMDUpdateTable";
import GMDUpdateHeader from "./GMDUpdateHeader";
import ErrorState from "./ErrorState";
import Skeleton from "./Skeleton";
import type { EngineeringDataState, EngineeringTableData, EngineeringTab } from "@/lib/gmd/types";
import { getPlaceholderIds, getPlaceholderRows } from "@/lib/gmd/placeholderData";

/** Rows shown until Phase 2 replaces the data source. */
function placeholderData(tab: EngineeringTab): EngineeringTableData {
  const rows = getPlaceholderRows(tab);
  return {
    headers: [...tab.headers],
    rows,
    ids: getPlaceholderIds(tab, rows),
    // Omitted on purpose: `GMDUpdateHeader` hides the "Last synced" readout when
    // it is undefined, and an "Never" that can never improve is worse than no
    // readout.
    syncedAt: undefined,
    totalRows: rows.length,
  };
}

/**
 * One subtab: the maroon title bar, a loading/error branch, and the table.
 *
 * `state` is optional. Phase 1 omits it and the panel falls back to generated
 * placeholder rows, so every table feature — sorting, filters, groups, merges,
 * resize, export — is usable before the Google Sheets integration lands. Phase 2
 * passes a real `state` and the fallback disappears.
 */
export default function TechnicalTablePanel({
  tab,
  state,
}: {
  tab: EngineeringTab;
  state?: EngineeringDataState;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const resolved = useMemo<EngineeringDataState>(
    () => state ?? { status: "ready", data: placeholderData(tab) },
    [state, tab],
  );

  return (
    <div
      className="flex flex-col"
      role="tabpanel"
      id={`panel-${tab.key}`}
      aria-labelledby={`tab-${tab.key}`}
    >
      {resolved.status === "error" ? (
        <>
          <GMDUpdateHeader title={tab.label} totalRows={0} />
          <ErrorState message={resolved.message} />
        </>
      ) : resolved.status === "loading" ? (
        <>
          <GMDUpdateHeader title={tab.label} totalRows={0} />
          <div className="flex flex-col gap-2 bg-white border border-line border-t-0 rounded-b-lg p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        </>
      ) : (
        <>
          <GMDUpdateHeader
            title={tab.label}
            totalRows={resolved.data.totalRows}
            syncedAt={resolved.data.syncedAt}
          />
          <p className="bg-surface-soft border-x border-b border-line px-6 py-2.5 text-[13px] text-ink-muted">
            {tab.description}
          </p>
          <GMDUpdateTable
            headers={resolved.data.headers}
            rows={resolved.data.rows}
            ids={resolved.data.ids}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            statusColumns={tab.statusColumns}
            numericColumns={tab.numericColumns}
            hiddenFilters={tab.hiddenFilters}
            hiddenColumns={tab.hiddenColumns}
            groupByColumn={tab.groupByColumn}
            mergeColumns={tab.mergeColumns}
            mergeTypeColumn={tab.mergeTypeColumn}
            mergeOnlyTypes={tab.mergeOnlyTypes}
            columnGroups={tab.columnGroups}
            defaultColumnWidths={tab.defaultColumnWidths}
            imageButtonColumn={tab.imageButtonColumn}
            maxHeight="70vh"
          />
        </>
      )}
    </div>
  );
}
