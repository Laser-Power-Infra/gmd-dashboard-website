"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Per-column value filter: a dropdown of checkboxes over the distinct values in
 * that column, plus a `(Blank)` entry so empty cells are reachable.
 *
 * `optionMeta` adds a one-line summary under each option — the Contract Review
 * dashboard uses it to show invoice counts and totals per party.
 *
 * Options are already cascaded by the table, so the list reflects the other
 * active filters rather than the full column.
 */
export default function MultiSelect({
  options,
  selected,
  onChange,
  optionMeta,
}: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  optionMeta?: Record<string, { count: number; sumLabel: string; partyName?: string }>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  };

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full text-[10px] border border-line rounded bg-white text-ink px-1 py-0.5 text-left outline-none cursor-pointer truncate hover:border-primary/50"
      >
        {selected.length ? `${selected.length} selected` : "All"}
      </button>
      {open && (
        <div
          className={`absolute top-full left-0 z-50 mt-1 bg-white border border-line rounded shadow-lg ${
            optionMeta ? "min-w-64 max-w-104" : "w-48"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="listbox"
        >
          <div className="flex justify-between items-center px-2 py-1.5 text-[10px] border-b border-line">
            <button
              type="button"
              onClick={() => onChange([...options])}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-red-600 font-semibold hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <label className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface-soft cursor-pointer text-[10px]">
              <input
                type="checkbox"
                checked={selected.includes("(Blank)")}
                onChange={() => toggle("(Blank)")}
                className="accent-primary"
              />
              <span className="italic text-ink/50">(Blank)</span>
            </label>
            {options.map((opt) => {
              const meta = optionMeta?.[opt];
              return (
                <label
                  key={opt}
                  className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface-soft cursor-pointer text-[10px]"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggle(opt)}
                    className="accent-primary"
                  />
                  <span className="flex-1 min-w-0 leading-tight">
                    <span className="block truncate font-medium">{opt}</span>
                    {meta && (
                      <>
                        {meta.partyName && (
                          <span className="block text-[9px] text-ink/60 truncate">
                            {meta.partyName}
                          </span>
                        )}
                        <span className="block text-[9px] text-ink/80">
                          {meta.count} · {meta.sumLabel}
                        </span>
                      </>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
