"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EngineeringDataTabs from "./EngineeringDataTabs";
import TechnicalTablePanel from "./TechnicalTablePanel";
import { ENGINEERING_TABS, resolveTab } from "@/lib/gmd/tableConfig";

/**
 * /engineering-data — six live GMD tables behind one subtab bar.
 *
 * The active tab lives in `?tab=` rather than in component state so a specific
 * table is shareable and survives a reload. `router.replace` keeps it out of the
 * history stack, so Back still leaves the page instead of walking the tabs.
 *
 * Must be rendered inside a Suspense boundary: `useSearchParams` opts the tree
 * out of static rendering, and `app/engineering-data/page.tsx` provides it.
 */
export default function EngineeringDataPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeKey = resolveTab(searchParams.get("tab")).key;

  const handleSelect = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      router.replace(`/engineering-data?tab=${key}`, { scroll: false });
    },
    [router, activeKey],
  );

  const activeTab = resolveTab(activeKey);

  return (
    <div className="bg-bg-light min-h-screen">
      <section className="bg-primary py-12 md:py-16">
        <div className="container">
          <div className="mb-3 flex items-center justify-center">
            <div className="flex items-center rounded-full bg-white/15 px-5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <span className="mx-3 h-0.5 w-10 bg-accent" />
              TECHNICAL
              <span className="mx-3 h-0.5 w-10 bg-accent" />
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold text-white md:text-4xl">
            Engineering Data
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-center text-base text-white/85">
            Live engineering tables maintained by our quoting and contracts team.
            Search, filter and export any of the six views below.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <EngineeringDataTabs
            tabs={ENGINEERING_TABS}
            activeKey={activeKey}
            onSelect={handleSelect}
          />
          <div className="p-4">
            <TechnicalTablePanel tab={activeTab} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Figures are indicative and update as the source sheet is revised. For a
          certified statement on any value shown, please raise a cost request.
        </p>
      </section>
    </div>
  );
}
