import type { ColumnGroup } from "./columns";
import {
  BIS_STATUS_COLUMN_WIDTHS,
  BIS_STATUS_HEADERS,
  BIS_STATUS_NUMERIC_COLUMNS,
  BIS_STATUS_STATUS_COLUMNS,
  CONTRACT_REVIEW_COLUMN_GROUPS,
  CONTRACT_REVIEW_COLUMN_WIDTHS,
  CONTRACT_REVIEW_HEADERS,
  CONTRACT_REVIEW_NUMERIC_COLUMNS,
  CONTRACT_REVIEW_STATUS_COLUMNS,
  PHYSICAL_STOCK_COLUMN_WIDTHS,
  PHYSICAL_STOCK_HEADERS,
  PHYSICAL_STOCK_NUMERIC_COLUMNS,
  PHYSICAL_STOCK_STATUS_COLUMNS,
  RAW_MATERIAL_HEADERS,
  RAW_MATERIAL_NUMERIC_COLUMNS,
  RAW_MATERIAL_STATUS_COLUMNS,
  SUPPLY_HISTORY_COLUMN_WIDTHS,
  SUPPLY_HISTORY_HEADERS,
  SUPPLY_HISTORY_NUMERIC_COLUMNS,
  SUPPLY_HISTORY_STATUS_COLUMNS,
  VERIFY_BOM_HEADERS,
  VERIFY_BOM_NUMERIC_COLUMNS,
  VERIFY_BOM_STATUS_COLUMNS,
} from "./columns";

/**
 * One Engineering Data subtab.
 *
 * `sheetName` is the tab title in the source spreadsheet and is what the Phase 2
 * Google Sheets fetcher will request. It is declared now so the wiring in Phase 2
 * is a lookup rather than a design decision.
 */
export type EngineeringTab = {
  /** Stable slug, used in the URL (`?tab=`) and as a React key. */
  key: string;
  /** Caption shown on the subtab. */
  label: string;
  /** One-line description shown under the page title. */
  description: string;
  /** Tab title in the source spreadsheet. */
  sheetName: string;
  /** Column captions, in order. Indexes match the row arrays. */
  headers: readonly string[];
  /** Headers rendered as a status pill rather than plain text. */
  statusColumns: ReadonlySet<string>;
  /** Headers rendered right-aligned in a tabular-nums face. */
  numericColumns: ReadonlySet<string>;
  /** Column captions collapsed into one parent column. */
  columnGroups?: ColumnGroup[];
  /** Per-column default width in px, keyed by header. */
  defaultColumnWidths?: Record<string, number>;
  /** Columns merged into a single row-spanning cell, grouped by `groupByColumn`. */
  groupByColumn?: string;
  mergeColumns?: string[];
  /** Only merge runs whose `mergeTypeColumn` value is in this list. */
  mergeTypeColumn?: string;
  mergeOnlyTypes?: string[];
  /** Columns hidden from the table. */
  hiddenColumns?: string[];
  /** Columns whose filter controls are suppressed. */
  hiddenFilters?: string[];
  /** Word-wrap captions and cell values instead of ellipsising them. */
  wrapCells?: boolean;
  /**
   * When true the cell in this column opens the image-gallery dialog rather than
   * rendering as text. Only meaningful while `itemImagesByCode` is supplied.
   */
  imageButtonColumn?: string;
  /**
   * Rows carrying a date in `groupByColumn` are collapsed onto the first row of
   * the run, so a 60-row BOM shows as a handful of blocks.
   */
  freezeLeadingColumns?: boolean;
};

export const ENGINEERING_TABS: EngineeringTab[] = [
  {
    key: "raw-material",
    label: "Raw Material",
    description:
      "Items awaiting creation or update, with proposed classifications, HSN codes and costing.",
    sheetName: "GMD UPDATION",
    headers: RAW_MATERIAL_HEADERS,
    statusColumns: RAW_MATERIAL_STATUS_COLUMNS,
    numericColumns: RAW_MATERIAL_NUMERIC_COLUMNS,
    defaultColumnWidths: { "ITEM NAME (proposed)-AUTO": 200 },
  },
  {
    key: "verify-bom",
    label: "Verify BOM",
    description:
      "Bills of material grouped by BOM ID, with usage decisions and available raw material stock.",
    sheetName: "VERIFY BOM",
    headers: VERIFY_BOM_HEADERS,
    statusColumns: VERIFY_BOM_STATUS_COLUMNS,
    numericColumns: VERIFY_BOM_NUMERIC_COLUMNS,
    defaultColumnWidths: { "ITEM NAME": 220, "ITEM SCHEDULE NAME": 220 },
    groupByColumn: "BOM ID",
    mergeColumns: [
      "BOM ID",
      "ITEM CODE",
      "ITEM NAME",
      "ITEM SCHEDULE NAME",
      "BOM ID TYPE",
      "USE/NO USE",
      "AVAILABLE STOCK",
    ],
    mergeTypeColumn: "BOM ID TYPE",
    mergeOnlyTypes: ["2:1", "3:1"],
    hiddenColumns: ["ITEM SCHEDULE NAME"],
  },
  {
    key: "contract-review",
    label: "Contract Review",
    description:
      "Live order position by contract: quantities, material certificates, bill and dispatch balances.",
    sheetName: "Contract Review",
    headers: CONTRACT_REVIEW_HEADERS,
    statusColumns: CONTRACT_REVIEW_STATUS_COLUMNS,
    numericColumns: CONTRACT_REVIEW_NUMERIC_COLUMNS,
    columnGroups: CONTRACT_REVIEW_COLUMN_GROUPS,
    defaultColumnWidths: CONTRACT_REVIEW_COLUMN_WIDTHS,
    hiddenColumns: ["Upload Drawing"],
  },
  {
    key: "supply-history",
    label: "Supply History",
    description:
      "Every invoice raised against a party, with warranty and performance bank guarantee validity.",
    sheetName: "MASTER",
    headers: SUPPLY_HISTORY_HEADERS,
    statusColumns: SUPPLY_HISTORY_STATUS_COLUMNS,
    numericColumns: SUPPLY_HISTORY_NUMERIC_COLUMNS,
    defaultColumnWidths: SUPPLY_HISTORY_COLUMN_WIDTHS,
    hiddenFilters: ["Order Qty"],
  },
  {
    key: "bis-status",
    label: "BIS Status",
    description: "BIS licence and application status per item, with expiry dates.",
    sheetName: "BIS Status",
    headers: BIS_STATUS_HEADERS,
    statusColumns: BIS_STATUS_STATUS_COLUMNS,
    numericColumns: BIS_STATUS_NUMERIC_COLUMNS,
    defaultColumnWidths: BIS_STATUS_COLUMN_WIDTHS,
  },
  {
    key: "physical-stock",
    label: "Physical Stock",
    description:
      "Physical godown stock against ERP, with movement in the last three months and shortfalls.",
    sheetName: "stock-phys",
    headers: PHYSICAL_STOCK_HEADERS,
    statusColumns: PHYSICAL_STOCK_STATUS_COLUMNS,
    numericColumns: PHYSICAL_STOCK_NUMERIC_COLUMNS,
    defaultColumnWidths: PHYSICAL_STOCK_COLUMN_WIDTHS,
  },
];

export const DEFAULT_TAB_KEY = ENGINEERING_TABS[0].key;

/** Resolves a `?tab=` value to a known tab, falling back to the first one. */
export function resolveTab(key: string | null | undefined): EngineeringTab {
  return (
    ENGINEERING_TABS.find((tab) => tab.key === key) ??
    ENGINEERING_TABS.find((tab) => tab.key === DEFAULT_TAB_KEY)!
  );
}
