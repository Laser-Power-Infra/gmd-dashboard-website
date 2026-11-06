"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EngineeringDataTabs from "./EngineeringDataTabs";
import TechnicalTablePanel from "./TechnicalTablePanel";
import { VISIBLE_TABS, resolveTab } from "@/lib/gmd/tableConfig";
import type { DensityPair } from "@/lib/gmd/types";

/**
 * /engineering-data — the GMD technical tables behind one subtab bar, served
 * from Postgres.
 *
 * The active tab lives in `?tab=` rather than in component state so a specific
 * table is shareable and survives a reload. `router.replace` keeps it out of the
 * history stack, so Back still leaves the page instead of walking the tabs.
 *
 * Syncing is per-tab and lives in each table's header (`TechnicalTablePanel`),
 * which reloads itself after a sync — so this page does not coordinate it. It
 * only owns the density reference strip: that is fetched once here because the
 * panel remounts on every tab switch and would otherwise re-request it.
 *
 * Must be rendered inside a Suspense boundary: `useSearchParams` opts the tree
 * out of static rendering, and `app/engineering-data/page.tsx` provides it.
 */
export default function EngineeringDataPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [densityPairs, setDensityPairs] = useState<DensityPair[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/engineering-data/density", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { rows?: unknown[][] } | null) => {
        const rows = body?.rows ?? [];
        setDensityPairs(
          rows
            .map((row) => ({
              material: String(row[0] ?? "").trim(),
              density: String(row[1] ?? "").trim(),
            }))
            .filter((pair) => pair.material !== ""),
        );
      })
      // Supplementary reference: if it fails, the tables still work and the
      // strip simply does not render.
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

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
            Search, filter and export any of the views below.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <EngineeringDataTabs
            tabs={VISIBLE_TABS}
            activeKey={activeKey}
            onSelect={handleSelect}
          />
          <div className="p-4">
            {/* Keyed on the tab so switching remounts the panel: the new tab
                starts in its loading state instead of briefly showing the
                previous tab's rows. */}
            <TechnicalTablePanel
              key={activeTab.key}
              tab={activeTab}
              densityPairs={densityPairs}
            />
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
