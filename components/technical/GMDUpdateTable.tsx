"use client";

import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { ChevronUp, ChevronDown, Search, RotateCcw, X, Download } from "lucide-react";
import { toast } from "sonner";

import GMDUpdateStatusBadge from "./GMDUpdateStatusBadge";
import MultiSelect from "./MultiSelect";
import OrderListCell from "./OrderListCell";
import ItemImageCell from "./ItemImageCell";
import DebouncedSearchInput from "./DebouncedSearchInput";
import Pagination from "./Pagination";
import { isUrl, renderLinksCell } from "./linksCell";
import { parseGmdDate } from "@/lib/gmd/dateParse";
import {
  cellHasValue,
  cellIsZero,
  FLOW_HAS_VALUE,
  FLOW_NO_VALUE,
  FLOW_NON_ZERO,
  FLOW_ZERO,
} from "@/lib/gmd/flowFilter";
import type { ItemImage } from "@/lib/gmd/types";

/* -------------------------------------------------------------------------- */
/* Column groups                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Two or more columns collapsed into a single rendered column. No Engineering
 * Data tab uses this today, but the table keeps the capability so a future tab
 * with many sparse sub-columns can group them without a rewrite.
 */
export type ColumnGroupChild = {
  header: string;
  /** Short caption shown next to the field inside the collapsed cell. */
  label?: string;
};

export type ColumnGroup = {
  /** Parent header caption. */
  label: string;
  /** Rendered width of the single collapsed column. */
  width?: number;
  children: ColumnGroupChild[];
};

/* -------------------------------------------------------------------------- */
/* Date / value comparison                                                     */
/* -------------------------------------------------------------------------- */

// Date parsing lives in lib/gmd/dateParse.ts so this table and the future
// sync-time normaliser cannot drift apart. See that file for why a bare numeric
// string must never be treated as a date.
function parseDate(str: string): Date | null {
  return parseGmdDate(str);
}

type DateRange = { from: string; to: string; blank?: boolean };

const DATE_SORT_HEADERS = new Set([
  "Date",
  "expiryDate",
  "PBG VALID TILL",
  "PBG CLAIM TILL",
]);

function isDateHeader(header: string): boolean {
  if (DATE_SORT_HEADERS.has(header)) return true;
  const l = header.toLowerCase();
  return l.includes("date") || l.includes("warranty");
}

function compareDates(aVal: unknown, bVal: unknown, dir: number): number {
  const aStr = String(aVal ?? "").trim();
  const bStr = String(bVal ?? "").trim();
  const aT = aStr ? parseDate(aStr)?.getTime() : null;
  const bT = bStr ? parseDate(bStr)?.getTime() : null;
  const aNull = aT == null || isNaN(aT);
  const bNull = bT == null || isNaN(bT);
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;
  if (aT === bT) return 0;
  return (aT < bT ? -1 : 1) * dir;
}

function cellCompare(aVal: unknown, bVal: unknown, dir: number): number {
  const aNum = typeof aVal === "number" ? aVal : NaN;
  const bNum = typeof bVal === "number" ? bVal : NaN;
  if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;
  const aKey = isNaN(aNum) ? String(aVal ?? "").toLowerCase() : "";
  const bKey = isNaN(bNum) ? String(bVal ?? "").toLowerCase() : "";
  const aNull = aKey === "" && isNaN(aNum);
  const bNull = bKey === "" && isNaN(bNum);
  if (aNull && bNull) return 0;
  if (aNull) return dir;
  if (bNull) return -dir;
  return aKey.localeCompare(bKey, undefined, { numeric: true }) * dir;
}

function cellEq(rowA: unknown[], rowB: unknown[], colIdx: number): boolean {
  return String(rowA[colIdx] ?? "") === String(rowB[colIdx] ?? "");
}

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/** A rendered column: either a standalone header, or a collapsed group. */
type ResolvedCol = {
  header: string;
  idx: number;
  group?: ColumnGroup;
};

const DEFAULT_GROUP_WIDTH = 300;
const FROZEN_VISIBLE_COLUMNS = 2;

/**
 * Class string for a wrapped text cell that must not stretch its row: content
 * wraps, the box is capped, and anything past the cap scrolls inside the cell.
 *
 * `cell-scrollable` (app/globals.css) keeps the scrollbar 4px wide — with 60+
 * columns on screen a default-width scrollbar per overflowing cell would swamp
 * the grid. `max-h-16` is 64px, which at text-xs/leading-normal (18px a line)
 * shows 3 full lines before the cell starts scrolling.
 */
const WRAPPED_CELL_BOX =
  "max-h-16 overflow-y-auto overflow-x-hidden cell-scrollable whitespace-normal leading-normal break-words";

export type GMDUpdateTableProps = {
  /** Column captions, in order. Indexes match the row arrays. */
  headers: string[];
  /** Data rows, each aligned to `headers`. */
  rows: unknown[][];
  /** Row ids, parallel to `rows`. */
  ids: string[];
  /** Index of the highlighted row within the current page, or null. */
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  /** Caption shown at the left of the toolbar. */
  title?: string;
  /** Headers rendered as a status pill rather than plain text. */
  statusColumns: ReadonlySet<string>;
  /** Headers rendered right-aligned in a tabular-nums face. */
  numericColumns: ReadonlySet<string>;
  /** Captions whose filter controls are suppressed. */
  hiddenFilters?: string[];
  /** Captions omitted from the table entirely. */
  hiddenColumns?: string[];
  /** Rows sharing a value in this column are collapsed onto one block. */
  groupByColumn?: string;
  /** Captions merged into a single row-spanning cell. */
  mergeColumns?: string[];
  /** Only merge runs whose `mergeTypeColumn` value is in this list. */
  mergeTypeColumn?: string;
  mergeOnlyTypes?: string[];
  /** Restricts a column's filter options to this set. */
  categoryOptions?: Record<string, string[]>;
  /** Replaces a column's computed filter options outright. */
  filterOptionsOverride?: Record<string, string[]>;
  /** Per-option summary shown under each entry in the multi-select. */
  columnOptionMeta?: Record<
    string,
    Record<string, { count: number; sumLabel: string; partyName?: string }>
  >;
  /** Fill the available height instead of using `maxHeight`. */
  fullHeight?: boolean;
  /** Scroll cap when `fullHeight` is off. */
  maxHeight?: string;
  /** Called after "Reset Filters" so the host can clear its own filters too. */
  onReset?: () => void;
  /** Shows "Reset Filters" even when this table has no filters of its own. */
  externalFiltersActive?: boolean;
  /** Column captions collapsed into a single parent column. */
  columnGroups?: ColumnGroup[];
  /**
   * Per-column default widths in px, keyed by header. Seeds `columnWidths` on
   * mount only, so a manual drag-resize still wins for the rest of the session.
   * Columns absent from the map fall through to the built-in defaults.
   */
  defaultColumnWidths?: Record<string, number>;
  /**
   * Word-wrap header captions and cell values onto as many lines as they need,
   * instead of ellipsising them, and top-align body cells so a tall wrapped cell
   * lines up with its neighbours. Off by default.
   */
  wrapCells?: boolean;
  /**
   * Caption of the column that opens the image gallery instead of rendering as
   * text. Requires `itemImagesByCode`.
   */
  imageButtonColumn?: string;
  /** Images per item code, keyed by the code shown in that column. */
  itemImagesByCode?: Record<string, ItemImage[]>;
  /**
   * Extra content rendered in the toolbar immediately after the "Showing X of Y
   * records" count. The table does not fetch this itself — callers pass a
   * ready-rendered node (e.g. the density reference strip).
   */
  toolbarExtra?: ReactNode;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function GMDUpdateTable({
  headers,
  rows,
  ids,
  selectedIndex,
  onSelect,
  title,
  statusColumns,
  numericColumns,
  hiddenFilters,
  hiddenColumns,
  groupByColumn,
  mergeColumns,
  mergeTypeColumn,
  mergeOnlyTypes,
  categoryOptions,
  filterOptionsOverride,
  columnOptionMeta,
  fullHeight,
  maxHeight,
  onReset,
  externalFiltersActive,
  columnGroups,
  defaultColumnWidths,
  wrapCells,
  imageButtonColumn,
  itemImagesByCode,
  toolbarExtra,
}: GMDUpdateTableProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [multiFilters, setMultiFilters] = useState<Record<string, string[]>>({});
  const [dateRanges, setDateRanges] = useState<Record<string, DateRange>>({});

  /* ---------------------------------------------------------------- columns */

  const hiddenSet = useMemo(
    () => new Set(hiddenColumns ?? []),
    [hiddenColumns],
  );

  /**
   * Headers that get a from/to date-range pair rather than a value multi-select.
   * Explicit list plus a "contains date" fallback so a renamed column on the
   * sheet keeps its range filter.
   */
  const isDateFilterHeader = useCallback(
    (header: string) =>
      header === "Date" ||
      header === "expiryDate" ||
      header === "DATE OF CONTRACT" ||
      header === "LC DATE/RTGS DATE" ||
      header === "LAST DATE OF SHIPMENT/DATE OF LC" ||
      header.toLowerCase().includes("date"),
    [],
  );

  const groupByIdx = groupByColumn ? headers.indexOf(groupByColumn) : -1;
  const mergeTypeIdx = mergeTypeColumn ? headers.indexOf(mergeTypeColumn) : -1;

  const isMergeable = useCallback(
    (row: unknown[]): boolean => {
      if (mergeTypeIdx === -1 || !mergeOnlyTypes || mergeOnlyTypes.length === 0) {
        return true;
      }
      return mergeOnlyTypes.includes(String(row[mergeTypeIdx] ?? "").trim());
    },
    [mergeTypeIdx, mergeOnlyTypes],
  );

  const mergeIdxSet = useMemo(
    () =>
      new Set(
        (mergeColumns ?? [])
          .map((h) => headers.indexOf(h))
          .filter((i) => i >= 0),
      ),
    [mergeColumns, headers],
  );
  const isGrouped = groupByIdx >= 0 && mergeIdxSet.size > 0;

  /**
   * Maps every group child to its owning group so a group can be collapsed onto
   * its first *visible* child. Children in `hiddenColumns` are skipped, so a
   * group whose leading child is hidden still renders on its next visible child.
   */
  const groupByChild = useMemo(() => {
    const map = new Map<string, { group: ColumnGroup; isFirst: boolean }>();
    if (!columnGroups) return map;
    for (const group of columnGroups) {
      const visibleChildren = group.children.filter(
        (c) => headers.includes(c.header) && !hiddenSet.has(c.header),
      );
      visibleChildren.forEach((child, i) => {
        if (map.has(child.header)) return;
        map.set(child.header, { group, isFirst: i === 0 });
      });
    }
    return map;
  }, [columnGroups, headers, hiddenSet]);

  const visibleCols: ResolvedCol[] = useMemo(() => {
    const out: ResolvedCol[] = [];
    headers.forEach((header, idx) => {
      if (hiddenSet.has(header)) return;
      const info = groupByChild.get(header);
      if (!info) {
        out.push({ header, idx });
        return;
      }
      // Non-first children are absorbed into the group's single column.
      if (!info.isFirst) return;
      const children = info.group.children.filter(
        (c) => headers.includes(c.header) && !hiddenSet.has(c.header),
      );
      if (children.length === 0) {
        out.push({ header, idx });
        return;
      }
      out.push({ header, idx, group: { ...info.group, children } });
    });
    return out;
  }, [headers, hiddenSet, groupByChild]);

  /* ----------------------------------------------------------------- widths */

  const [columnWidths, setColumnWidths] = useState<Record<number, number>>(
    () => {
      // A collapsed group seeds the width of the column it renders on, so a
      // later drag-resize behaves exactly like a standalone column.
      const groupWidthByHeader = new Map<string, number>();
      for (const g of columnGroups ?? []) {
        if (!g.width) continue;
        const anchor = g.children.find((c) => !hiddenSet.has(c.header));
        if (anchor) groupWidthByHeader.set(anchor.header, g.width);
      }
      const widths: Record<number, number> = {};
      headers.forEach((h, i) => {
        const gw = groupWidthByHeader.get(h);
        if (gw) {
          widths[i] = gw;
          return;
        }
        // Caller-supplied per-column defaults win over the built-in chain, so a
        // tab can size each of its columns without touching this file.
        const dw = defaultColumnWidths?.[h];
        if (typeof dw === "number" && dw > 0) {
          widths[i] = dw;
          return;
        }
        widths[i] =
          h === "ITEM NAME (proposed)-AUTO"
            ? 200
            : h === "Party Mail Address"
              ? 300
              : h === "ORDER LIST"
                ? 160
                : h === "CONTRACT NO"
                  ? 200
                  : 180;
      });
      return widths;
    },
  );

  const getColWidth = useCallback(
    (col: ResolvedCol) =>
      columnWidths[col.idx] ?? col.group?.width ?? DEFAULT_GROUP_WIDTH,
    [columnWidths],
  );

  /**
   * Left offsets for the frozen leading columns, derived from the *visible*
   * column order and real rendered widths so a collapsed group (wider than any
   * single child) cannot desync the header from the body.
   */
  const frozenOffsets = useMemo(() => {
    const offsets: (number | undefined)[] = [];
    let acc = 0;
    const count = Math.min(FROZEN_VISIBLE_COLUMNS, visibleCols.length);
    for (let i = 0; i < count; i++) {
      offsets.push(acc);
      acc += getColWidth(visibleCols[i]);
    }
    return offsets;
  }, [visibleCols, getColWidth]);

  /**
   * A live drag. `detach` is stored alongside the geometry so a drag that ends
   * outside the window (where `mouseup` never reaches the document) can still be
   * torn down from the `blur` handler below.
   */
  const resizingRef = useRef<{
    index: number;
    startX: number;
    startWidth: number;
    detach: () => void;
  } | null>(null);

  const handleResizeStart = useCallback(
    (index: number, e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizingRef.current?.detach();

      const onMove = (ev: globalThis.MouseEvent) => {
        const r = resizingRef.current;
        if (!r) return;
        const newWidth = Math.max(60, r.startWidth + (ev.clientX - r.startX));
        setColumnWidths((prev) => ({ ...prev, [r.index]: newWidth }));
      };
      const onUp = () => {
        resizingRef.current?.detach();
      };

      resizingRef.current = {
        index,
        startX: e.clientX,
        startWidth: columnWidths[index],
        detach: () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          document.body.style.cursor = "default";
          resizingRef.current = null;
        },
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
    },
    [columnWidths],
  );

  // A drag that ends outside the window never fires `mouseup` on the document,
  // which would leave the listener attached and the cursor stuck on col-resize.
  const handleResizeCancel = useCallback(() => {
    resizingRef.current?.detach();
  }, []);

  useEffect(() => {
    window.addEventListener("blur", handleResizeCancel);
    return () => window.removeEventListener("blur", handleResizeCancel);
  }, [handleResizeCancel]);

  /* --------------------------------------------------------------- handlers */

  const handleSort = (colIndex: number) => {
    if (sortColumn === colIndex) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(colIndex);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleColumnFilter = (header: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [header]: value }));
    setCurrentPage(1);
  };

  const handleMultiFilter = (header: string, values: string[]) => {
    setMultiFilters((prev) => {
      const next = { ...prev };
      if (values.length) next[header] = values;
      else delete next[header];
      return next;
    });
    setCurrentPage(1);
  };

  const setDateRange = useCallback((header: string, from: string, to: string) => {
    setDateRanges((prev) => {
      const next = { ...prev };
      const existingBlank = prev[header]?.blank;
      if (from || to) next[header] = { from, to, blank: existingBlank };
      else if (existingBlank) next[header] = { from: "", to: "", blank: true };
      else delete next[header];
      return next;
    });
    setCurrentPage(1);
  }, []);

  const setDateBlank = useCallback((header: string, blank: boolean) => {
    setDateRanges((prev) => {
      const next = { ...prev };
      if (blank) next[header] = { from: "", to: "", blank: true };
      else if (next[header]) {
        const { from, to } = next[header];
        if (from || to) next[header] = { from, to };
        else delete next[header];
      }
      return next;
    });
    setCurrentPage(1);
  }, []);

  const handleResetFilters = () => {
    setColumnFilters({});
    setMultiFilters({});
    setGlobalSearch("");
    setDateRanges({});
    setCurrentPage(1);
    onReset?.();
  };

  const handleExportToExcel = async () => {
    const toastId = toast.loading("Preparing Excel file...");
    try {
      const exportRows = filteredRows.map((row) => {
        const obj: Record<string, unknown> = {};
        visibleCols.forEach(({ header, idx }) => {
          const v = row[idx];
          obj[header] = v != null ? String(v) : "";
        });
        return obj;
      });
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      const dateStr = new Date().toISOString().split("T")[0];
      XLSX.writeFile(
        workbook,
        `${title?.replace(/\s+/g, "_") || "Export"}_${dateStr}.xlsx`,
      );
      toast.success("Excel file downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Export to Excel failed:", err);
      toast.error("Failed to export Excel file.", { id: toastId });
    }
  };

  const hasActiveFilters =
    Object.values(columnFilters).some((v) => v && v !== "All") ||
    Object.values(multiFilters).some((v) => v.length > 0) ||
    globalSearch.trim() !== "" ||
    Object.values(dateRanges).some((r) => r.from || r.to || r.blank);

  const showResetFilters = hasActiveFilters || !!externalFiltersActive;

  /* ------------------------------------------------------- sort and filter */

  const sortedWithIds = useMemo(() => {
    const decorated = rows.map((row, i) => ({ row, id: ids[i], i }));
    if (sortColumn === null && !isGrouped) return decorated;
    const dir = sortDirection === "asc" ? 1 : -1;
    const sortHeader = sortColumn !== null ? (headers[sortColumn] ?? "") : "";
    const isDateSort = sortColumn !== null && isDateHeader(sortHeader);
    decorated.sort((a, b) => {
      if (isGrouped) {
        const g = cellCompare(a.row[groupByIdx], b.row[groupByIdx], 1);
        if (g !== 0) return g;
      }
      if (sortColumn !== null) {
        const c = isDateSort
          ? compareDates(a.row[sortColumn], b.row[sortColumn], dir)
          : cellCompare(a.row[sortColumn], b.row[sortColumn], dir);
        if (c !== 0) return c;
      }
      return a.i - b.i;
    });
    return decorated;
  }, [rows, ids, sortColumn, sortDirection, isGrouped, groupByIdx, headers]);

  const rowSearchCache = useMemo(() => {
    const cache = new Map<unknown[], string>();
    for (const row of rows) {
      cache.set(
        row,
        headers.map((_, i) => String(row[i] ?? "").toLowerCase()).join(" "),
      );
    }
    return cache;
  }, [rows, headers]);

  /**
   * `excludeHeader` skips one column's own filter. The cascaded option lists
   * need it, otherwise a column narrows its own options to just the value
   * already selected and the rest become unreachable.
   */
  const rowPassesFilters = useCallback(
    (row: unknown[], excludeHeader?: string): boolean => {
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        if (!(rowSearchCache.get(row) ?? "").includes(q)) return false;
      }

      for (const [colName, filterVal] of Object.entries(columnFilters)) {
        if (colName === excludeHeader) continue;
        if (!filterVal || filterVal === "All") continue;
        const colIdx = headers.indexOf(colName);
        if (colIdx === -1) continue;
        const cellVal = String(row[colIdx] ?? "");
        if (filterVal === "(Blank)" || filterVal === "-" || filterVal === "—") {
          if (cellVal !== "") return false;
        } else if (!cellVal.toLowerCase().includes(filterVal.toLowerCase())) {
          return false;
        }
      }

      for (const [colName, selected] of Object.entries(multiFilters)) {
        if (colName === excludeHeader) continue;
        if (!selected.length) continue;
        const colIdx = headers.indexOf(colName);
        if (colIdx === -1) continue;
        const cellVal = String(row[colIdx] ?? "").trim();
        const matchesBlank = selected.includes("(Blank)") && cellVal === "";
        const matchesHasValue =
          selected.includes(FLOW_HAS_VALUE) && cellHasValue(cellVal);
        const matchesNoValue =
          selected.includes(FLOW_NO_VALUE) && !cellHasValue(cellVal);
        const matchesZero = selected.includes(FLOW_ZERO) && cellIsZero(cellVal);
        const matchesNonZero =
          selected.includes(FLOW_NON_ZERO) && !cellIsZero(cellVal);
        if (
          !(
            matchesBlank ||
            matchesHasValue ||
            matchesNoValue ||
            matchesZero ||
            matchesNonZero ||
            selected.includes(cellVal)
          )
        ) {
          return false;
        }
      }

      for (const [colName, r] of Object.entries(dateRanges)) {
        if (colName === excludeHeader) continue;
        if (!r.from && !r.to && !r.blank) continue;
        const colIdx = headers.indexOf(colName);
        if (colIdx === -1) continue;
        const dateStr = String(row[colIdx] ?? "");
        if (r.blank) {
          if (dateStr !== "" && dateStr !== "-" && dateStr !== "—") return false;
          continue;
        }
        if (!dateStr) return false;
        const date = parseDate(dateStr);
        if (!date) return false;
        const fromDate = r.from ? new Date(r.from + "T00:00:00") : null;
        const toEnd = r.to ? new Date(r.to + "T23:59:59") : null;
        if (fromDate && date < fromDate) return false;
        if (toEnd && date > toEnd) return false;
      }

      return true;
    },
    [globalSearch, rowSearchCache, columnFilters, multiFilters, headers, dateRanges],
  );

  const filteredWithIds = useMemo(
    () => sortedWithIds.filter(({ row }) => rowPassesFilters(row)),
    [sortedWithIds, rowPassesFilters],
  );

  const filteredRows = filteredWithIds.map((v) => v.row);

  const totalRecords = filteredRows.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  /* ------------------------------------------------------ filter options */

  const getUniqueColumnValues = useCallback(
    (colIdx: number): string[] => {
      const vals = new Set<string>();
      for (const row of rows) {
        const v = String(row[colIdx] ?? "");
        if (v) vals.add(v);
      }
      return [...vals].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      );
    },
    [rows],
  );

  const columnUniqueVals = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const h of headers) {
      result[h] = getUniqueColumnValues(headers.indexOf(h));
    }
    return result;
  }, [headers, getUniqueColumnValues]);

  /**
   * Filter options narrowed by the *other* active filters, so a column's option
   * list never offers a value that would produce zero rows. An option already
   * selected is kept even if nothing else matches it, otherwise deselecting it
   * would be impossible.
   */
  const cascadedFilterOptions = useMemo(() => {
    if (!hasActiveFilters) {
      return {
        ...columnUniqueVals,
        ...(filterOptionsOverride ?? {}),
      };
    }
    const result: Record<string, string[]> = {};
    for (const h of headers) {
      const idx = headers.indexOf(h);
      const vals = new Set<string>();
      for (const row of rows) {
        // `excludeHeader` keeps a column's own filter out of its option list.
        if (!rowPassesFilters(row, h)) continue;
        const v = String(row[idx] ?? "");
        if (v) vals.add(v);
      }
      let list = [...vals].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      );
      if (categoryOptions?.[h]?.length) {
        const allowed = new Set(categoryOptions[h]);
        list = list.filter((v) => allowed.has(v));
      }
      for (const s of multiFilters[h] ?? []) {
        if (s !== "(Blank)" && !list.includes(s)) list.push(s);
      }
      result[h] = list;
    }
    for (const [h, vals] of Object.entries(filterOptionsOverride ?? {})) {
      result[h] = vals;
    }
    return result;
  }, [
    rows,
    headers,
    categoryOptions,
    multiFilters,
    hasActiveFilters,
    rowPassesFilters,
    columnUniqueVals,
    filterOptionsOverride,
  ]);

  /* ---------------------------------------------------------- pagination */

  const paginatedWithIds = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredWithIds.slice(start, start + pageSize);
  }, [filteredWithIds, activePage, pageSize]);

  /* --------------------------------------------------------------- merges */

  const { mergedSpans, mergedSkipped } = useMemo(() => {
    const spans = new Map<string, number>();
    const skipped = new Set<string>();
    if (!isGrouped) return { mergedSpans: spans, mergedSkipped: skipped };
    const list = paginatedWithIds;
    const n = list.length;
    for (const c of mergeIdxSet) {
      let i = 0;
      while (i < n) {
        let j = i;
        while (
          j + 1 < n &&
          isMergeable(list[j].row) &&
          isMergeable(list[j + 1].row) &&
          cellEq(list[j].row, list[j + 1].row, groupByIdx) &&
          cellEq(list[j].row, list[j + 1].row, c)
        ) {
          j++;
        }
        const len = j - i + 1;
        if (len > 1) {
          spans.set(`${i}:${c}`, len);
          for (let k = i + 1; k <= j; k++) skipped.add(`${k}:${c}`);
        }
        i = j + 1;
      }
    }
    return { mergedSpans: spans, mergedSkipped: skipped };
  }, [
    paginatedWithIds,
    isGrouped,
    groupByIdx,
    mergeIdxSet,
    isMergeable,
  ]);

  /* --------------------------------------------------------------- totals */

  const pbgAmountSum = useMemo(() => {
    const colIdx = headers.indexOf("PBG AMOUNT");
    if (colIdx === -1) return null;
    return filteredRows.reduce((sum, row) => {
      const num = parseFloat(String(row[colIdx] ?? "").replace(/,/g, ""));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }, [filteredRows, headers]);

  /* -------------------------------------------------------- cell rendering */

  /**
   * Class string for a text cell. `scrollable` is false inside a collapsed
   * group, because the group column caps and scrolls itself as a whole —
   * capping each child too would nest a scroller inside a scroller and clip the
   * other children out of reach.
   */
  const textCellClass = (scrollable: boolean) =>
    !wrapCells
      ? "truncate block"
      : scrollable
        ? `block ${WRAPPED_CELL_BOX}`
        : "block break-words";

  /**
   * Renders the body of one column. Lifted out of the row loop so a collapsed
   * column group can render each of its children through the exact same logic.
   */
  const renderCellContent = (
    header: string,
    cellIdx: number,
    row: unknown[],
    scrollable: boolean,
  ): ReactNode => {
    const value = row[cellIdx];
    const display = value != null ? String(value) : "";

    if (statusColumns.has(header)) {
      return <GMDUpdateStatusBadge value={display || null} />;
    }
    if (numericColumns.has(header)) {
      return (
        <span className="font-mono-md text-right text-ink">
          {display || "—"}
        </span>
      );
    }
    if (header === "ORDER LIST") {
      if (!display) {
        return <span className="truncate block text-ink-muted">—</span>;
      }
      const poIdx = headers.indexOf("PARTY Order No.");
      const poAltIdx = headers.indexOf("PO NO");
      const poVal = String(row[poIdx !== -1 ? poIdx : poAltIdx] ?? "");
      return <OrderListCell display={display} poNo={poVal} />;
    }
    if (imageButtonColumn && header === imageButtonColumn) {
      return (
        <ItemImageCell
          code={display}
          images={itemImagesByCode?.[display] ?? []}
        />
      );
    }
    if (display && isUrl(display)) {
      // Single URL case (non-ORDER LIST columns)
      return (
        <a
          href={display}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={
            wrapCells
              ? `block break-all ${scrollable ? WRAPPED_CELL_BOX : ""} underline text-blue-600 hover:text-blue-800`
              : "truncate block underline text-blue-600 hover:text-blue-800"
          }
          title={display}
        >
          {display}
        </a>
      );
    }
    if (
      display &&
      display.includes(",") &&
      display.split(",").some((p) => isUrl(p.trim()))
    ) {
      return (
        renderLinksCell(display) ?? (
          <span className={textCellClass(scrollable)} title={display}>
            {display || "—"}
          </span>
        )
      );
    }
    return (
      <span className={textCellClass(scrollable)} title={display}>
        {display || "—"}
      </span>
    );
  };

  /* ---------------------------------------------------------------- render */

  if (visibleCols.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full max-w-full min-w-0 bg-white border border-line rounded-lg shadow-sm ${
        fullHeight ? "flex-1 min-h-0 overflow-hidden h-full" : ""
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-line bg-surface-soft">
        <div className="flex flex-wrap items-center gap-2">
          {title && (
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              {title}
            </span>
          )}
          <span className="text-xs font-semibold text-ink/60">
            Showing {filteredRows.length.toLocaleString("en-IN")} of{" "}
            {rows.length.toLocaleString("en-IN")} records
          </span>
          {toolbarExtra}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <DebouncedSearchInput
              value={globalSearch}
              onCommit={(val) => {
                setGlobalSearch(val);
                setCurrentPage(1);
              }}
              placeholder="Search all columns..."
              className="w-60 pl-8 pr-7 py-1.5 text-xs border border-line rounded bg-white text-ink outline-none focus:border-primary placeholder:text-ink/30"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGlobalSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-line text-ink/50 hover:text-ink transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {showResetFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-red-800 hover:text-ink transition-colors px-2 py-1.5 rounded hover:bg-white/80 border border-line"
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
          <button
            type="button"
            onClick={handleExportToExcel}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors px-2 py-1.5 rounded hover:bg-white/80 border border-line"
          >
            <Download size={12} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Scrollable table */}
      <div
        className={`w-full min-w-0 ${
          fullHeight ? "flex-1 min-h-0 overflow-auto" : "overflow-x-auto overflow-y-auto"
        }`}
        style={fullHeight ? undefined : { maxHeight: maxHeight || "60vh" }}
      >
        <table
          className="w-full text-left"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            {visibleCols.map((col) => (
              <col key={col.idx} style={{ width: `${getColWidth(col)}px` }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-20">
            <tr className="bg-surface">
              {visibleCols.map((col, visIdx) => {
                const { header, idx, group } = col;
                const isSorted = sortColumn === idx;
                const uniqueVals = cascadedFilterOptions[header] ?? [];
                const frozenLeft = frozenOffsets[visIdx];

                if (group) {
                  const groupChildren = group.children.map((c) => c.header);
                  const isChildFiltered = (h: string) =>
                    (multiFilters[h]?.length ?? 0) > 0 ||
                    !!columnFilters[h] ||
                    !!dateRanges[h]?.from ||
                    !!dateRanges[h]?.to ||
                    !!dateRanges[h]?.blank;
                  const activeCount = groupChildren.filter(isChildFiltered).length;
                  const clearGroup = () => {
                    groupChildren.forEach((h) => {
                      handleMultiFilter(h, []);
                      handleColumnFilter(h, "");
                      if (isDateFilterHeader(h)) setDateRange(h, "", "");
                      setDateBlank(h, false);
                    });
                  };
                  return (
                    <th
                      key={idx}
                      className={`relative bg-surface text-ink text-xs font-bold uppercase tracking-wider px-2.5 py-2 text-left border-b-2 border-line border-r last:border-r-0 select-none align-top${
                        frozenLeft !== undefined ? " sticky z-20" : ""
                      }`}
                      style={
                        frozenLeft !== undefined ? { left: frozenLeft } : undefined
                      }
                    >
                      <div
                        className={`flex justify-between gap-1 ${
                          wrapCells ? "items-start" : "items-center"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={wrapCells ? "wrap-break-word" : "truncate"}>
                            {group.label}
                          </span>
                          {activeCount > 0 && (
                            <span className="inline-flex items-center justify-center h-4 px-1.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">
                              {activeCount}
                            </span>
                          )}
                        </div>
                        {activeCount > 0 && (
                          <button
                            type="button"
                            onClick={clearGroup}
                            className="inline-flex items-center gap-0.5 text-[9px] font-medium text-ink/60 hover:text-red-500 transition-colors"
                            title={`Clear ${group.label} filters`}
                          >
                            <X size={10} />
                            <span>Clear</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1 mt-1.5">
                        {group.children.map((child) => {
                          const ch = child.header;
                          const childActive = isChildFiltered(ch);
                          return (
                            <div
                              key={ch}
                              className="min-w-0 flex flex-col gap-1"
                            >
                              {isDateFilterHeader(ch) ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="date"
                                    value={dateRanges[ch]?.from ?? ""}
                                    onChange={(e) =>
                                      setDateRange(
                                        ch,
                                        e.target.value,
                                        dateRanges[ch]?.to ?? "",
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${ch} from`}
                                    className="flex-1 min-w-0 text-[10px] border border-line rounded bg-white text-ink px-1 py-0.5 outline-none focus:border-primary"
                                  />
                                  <input
                                    type="date"
                                    value={dateRanges[ch]?.to ?? ""}
                                    onChange={(e) =>
                                      setDateRange(
                                        ch,
                                        dateRanges[ch]?.from ?? "",
                                        e.target.value,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${ch} to`}
                                    className="flex-1 min-w-0 text-[10px] border border-line rounded bg-white text-ink px-1 py-0.5 outline-none focus:border-primary"
                                  />
                                </div>
                              ) : (
                                <MultiSelect
                                  options={cascadedFilterOptions[ch] ?? []}
                                  selected={multiFilters[ch] ?? []}
                                  onChange={(vals) => handleMultiFilter(ch, vals)}
                                  optionMeta={columnOptionMeta?.[ch]}
                                />
                              )}
                              <div className="flex items-center gap-1">
                                <DebouncedSearchInput
                                  value={columnFilters[ch] ?? ""}
                                  onCommit={(val) => handleColumnFilter(ch, val)}
                                  placeholder={`Search ${ch}...`}
                                />
                                {childActive && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColumnFilter(ch, "");
                                      handleMultiFilter(ch, []);
                                      if (isDateFilterHeader(ch))
                                        setDateRange(ch, "", "");
                                      setDateBlank(ch, false);
                                    }}
                                    className="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-line text-ink/50 hover:text-ink transition-colors"
                                    title={`Clear ${ch} filter`}
                                    aria-label={`Clear ${ch} filter`}
                                  >
                                    <X size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <ResizeHandle onMouseDown={(e) => handleResizeStart(idx, e)} />
                    </th>
                  );
                }

                return (
                  <th
                    key={idx}
                    className={`relative bg-surface text-ink text-xs font-bold uppercase tracking-wider px-3 py-2 text-left border-b-2 border-line border-r last:border-r-0 select-none align-top${
                      frozenLeft !== undefined ? " sticky z-20" : ""
                    }`}
                    style={
                      frozenLeft !== undefined ? { left: frozenLeft } : undefined
                    }
                  >
                    <div
                      className={`flex justify-between gap-1.5 cursor-pointer ${
                        wrapCells ? "items-start" : "items-center"
                      }`}
                      onClick={() => handleSort(idx)}
                    >
                      <span className={wrapCells ? "wrap-break-word" : "truncate"}>
                        {header}
                      </span>
                      {isSorted && (
                        <span className="shrink-0 text-[10px] text-primary">
                          {sortDirection === "asc" ? (
                            <ChevronUp size={10} />
                          ) : (
                            <ChevronDown size={10} />
                          )}
                        </span>
                      )}
                    </div>

                    {!hiddenFilters?.includes(header) &&
                      (isDateFilterHeader(header) ? (
                        <div className="flex flex-col gap-1 mt-1.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="date"
                              value={dateRanges[header]?.from ?? ""}
                              onChange={(e) =>
                                setDateRange(
                                  header,
                                  e.target.value,
                                  dateRanges[header]?.to ?? "",
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`${header} from`}
                              className="flex-1 min-w-0 text-[10px] border border-line rounded bg-white text-ink px-1 py-0.5 outline-none focus:border-primary"
                            />
                            <input
                              type="date"
                              value={dateRanges[header]?.to ?? ""}
                              onChange={(e) =>
                                setDateRange(
                                  header,
                                  dateRanges[header]?.from ?? "",
                                  e.target.value,
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`${header} to`}
                              className="flex-1 min-w-0 text-[10px] border border-line rounded bg-white text-ink px-1 py-0.5 outline-none focus:border-primary"
                            />
                          </div>
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[10px] text-ink/70 cursor-pointer select-none"
                            title={`Show only rows with no ${header}`}
                          >
                            <input
                              type="checkbox"
                              checked={!!dateRanges[header]?.blank}
                              onChange={(e) =>
                                setDateBlank(header, e.target.checked)
                              }
                              className="accent-primary"
                            />
                            Blanks
                          </label>
                          <div className="flex items-center gap-1">
                            <DebouncedSearchInput
                              value={columnFilters[header] ?? ""}
                              onCommit={(val) =>
                                handleColumnFilter(header, val)
                              }
                              placeholder={`Search ${header}...`}
                            />
                            {(columnFilters[header] ||
                              dateRanges[header]?.from ||
                              dateRanges[header]?.to ||
                              dateRanges[header]?.blank) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleColumnFilter(header, "");
                                  setDateRange(header, "", "");
                                  setDateBlank(header, false);
                                }}
                                className="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-line text-ink/50 hover:text-ink transition-colors"
                                title="Clear filter"
                                aria-label={`Clear ${header} filter`}
                              >
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mt-1.5">
                          <MultiSelect
                            options={uniqueVals}
                            selected={multiFilters[header] ?? []}
                            onChange={(vals) => handleMultiFilter(header, vals)}
                            optionMeta={columnOptionMeta?.[header]}
                          />
                          <div className="flex items-center gap-1">
                            <DebouncedSearchInput
                              value={columnFilters[header] ?? ""}
                              onCommit={(val) =>
                                handleColumnFilter(header, val)
                              }
                              placeholder={`Search ${header}...`}
                            />
                            {columnFilters[header] && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleColumnFilter(header, "");
                                }}
                                className="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-line text-ink/50 hover:text-ink transition-colors"
                                title="Clear filter"
                                aria-label={`Clear ${header} filter`}
                              >
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                    {header === "PBG AMOUNT" && pbgAmountSum !== null && (
                      <div className="mt-1 text-[11px] font-semibold text-primary">
                        Total :{" "}
                        {pbgAmountSum.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </div>
                    )}

                    <ResizeHandle onMouseDown={(e) => handleResizeStart(idx, e)} />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedWithIds.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleCols.length}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  No matching rows
                </td>
              </tr>
            ) : (
              paginatedWithIds.map(({ row, id }, idx) => (
                <tr
                  key={id ?? idx}
                  className={`transition-colors hover:bg-surface-soft cursor-pointer ${
                    selectedIndex === idx ? "bg-primary/5" : ""
                  }`}
                  onClick={() => onSelect(idx)}
                >
                  {visibleCols.map((col, visIdx) => {
                    const { header, idx: cellIdx, group } = col;

                    const mergedKey = `${idx}:${cellIdx}`;
                    const isMergedCell = isGrouped && mergeIdxSet.has(cellIdx);
                    if (isMergedCell && mergedSkipped.has(mergedKey)) {
                      return null;
                    }
                    const mergedSpan = isMergedCell
                      ? mergedSpans.get(mergedKey)
                      : undefined;

                    const cellContent = group ? (
                      <div
                        className={
                          wrapCells
                            ? `flex flex-col gap-1 min-w-0 ${WRAPPED_CELL_BOX}`
                            : "flex flex-col gap-1"
                        }
                      >
                        {group.children.map((child) => {
                          const childIdx = headers.indexOf(child.header);
                          if (childIdx === -1) return null;
                          return (
                            <div
                              key={child.header}
                              title={child.header}
                              className={`flex items-center gap-1 min-w-0 rounded border border-line bg-white px-1.5 py-0.5 hover:border-primary/40 transition-colors${
                                // The group container is a capped column flex box
                                // once wrapCells is on; without this a child could be
                                // squashed to fit the cap instead of scrolling.
                                wrapCells ? " shrink-0" : ""
                              }`}
                            >
                              <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-ink/55">
                                {child.label ?? child.header}
                              </span>
                              <span className="flex-1 min-w-0 text-xs text-ink">
                                {renderCellContent(
                                  child.header,
                                  childIdx,
                                  row,
                                  false,
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      renderCellContent(header, cellIdx, row, true)
                    );

                    const frozenLeft = frozenOffsets[visIdx];

                    return (
                      <td
                        key={cellIdx}
                        rowSpan={mergedSpan}
                        className={`${group ? "px-2" : "px-3"} py-2 text-xs border-b border-line border-r last:border-r-0${
                          wrapCells ? " align-top" : ""
                        }${frozenLeft !== undefined ? " sticky z-10 bg-white" : ""}`}
                        style={
                          frozenLeft !== undefined ? { left: frozenLeft } : undefined
                        }
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        total={totalRecords}
        currentPage={activePage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

/**
 * Drag handle that resizes a column. A 14px hit area straddles the cell border
 * so a 1px rule is still easy to grab, and the visible 2px bar only tints on
 * hover to keep a 60-column header readable.
 */
function ResizeHandle({ onMouseDown }: { onMouseDown: (e: ReactMouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      role="separator"
      aria-label="Resize column"
      className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize z-20 group"
      style={{ marginRight: "-3px" }}
    >
      <div className="absolute top-0 -left-1 w-3.5 h-full" />
      <div className="absolute right-0.5 top-0 w-0.5 h-full bg-transparent group-hover:bg-primary group-active:bg-primary transition-colors" />
    </div>
  );
}
