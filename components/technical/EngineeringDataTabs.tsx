"use client";

import type { EngineeringTab } from "@/lib/gmd/types";

/**
 * Subtab bar for the Engineering Data tables.
 *
 * Hand-rolled rather than shadcn `tabs`: the site has no tab primitive and its
 * one existing filter-bar pattern (`components/pages/ValvesPage.tsx`) is a plain
 * button list with an `.active` class. This follows that shape, restyled as an
 * underline bar so it reads as navigation rather than as a filter.
 *
 * The bar is a horizontal scroller on narrow screens — Contract Review's six
 * captions do not fit a phone row.
 */
export default function EngineeringDataTabs({
  tabs,
  activeKey,
  onSelect,
}: {
  tabs: EngineeringTab[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Engineering data tables"
      className="flex gap-1 overflow-x-auto border-b border-line"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
            onClick={() => onSelect(tab.key)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-ink-muted hover:border-line hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
