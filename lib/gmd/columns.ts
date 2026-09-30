/**
 * Column definitions for the six Engineering Data tables.
 *
 * Each entry mirrors the header list the corresponding GMD dashboard reads out
 * of the source spreadsheet, in the same order. The order matters: it is the
 * contract between a tab's `headers` array and its `rows` (array-of-arrays)
 * data, and it is also what fixes the visual column order when a group is
 * collapsed — a group renders at the position of its first visible child.
 *
 * Ported from `gmd-quotation-process/lib/gmd_lib/*-columns.ts` and
 * `stock-physical-dashboard/lib/gmd_lib/sheet-columns.ts`. The Prisma row
 * serialisers that sat alongside these headers have been dropped: this site
 * reads straight from the sheet, so there is no DB row to map.
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

/** Raw Material — the "GMD UPDATION" sheet. */
export const RAW_MATERIAL_HEADERS = [
  "ERP ITEM CODE",
  "ITEM NAME (proposed)-AUTO",
  "L1",
  "L2-VALVE TYPE",
  "L3-DIA",
  "L7-DIMENSION",
  "L4-COMPONENT",
  "L5- MATERIAL",
  "L6-STD",
  "L8 -ITEM CATEGORY",
  "UM",
  "Available Stock",
  "CONV",
  "1 pcs wgt",
  "AUM",
  "cost",
  "USD cost",
  "HSN CODE",
  "HSN Code Validation",
  "CONV",
  "MAJOR MARKING",
  "NEW ITEM STATUS",
  "CURRENT STATUS",
  "RM TYPE",
  "INDIAN/IMPORTED",
  "Order Qty",
] as const;

export const RAW_MATERIAL_NUMERIC_COLUMNS = new Set([
  "Available Stock",
  "cost",
  "1 pcs wgt",
  "USD cost",
]);

export const RAW_MATERIAL_STATUS_COLUMNS = new Set([
  "NEW ITEM STATUS",
  "CURRENT STATUS",
  "RM TYPE",
  "INDIAN/IMPORTED",
]);

/** Verify BOM — the "VERIFY BOM" sheet. */
export const VERIFY_BOM_HEADERS = [
  "BOM ID",
  "ITEM CODE",
  "ITEM NAME",
  "ITEM SCHEDULE NAME",
  "RM ITEM CODE",
  "RM ITEM NAME",
  "BOM ID TYPE",
  "BOM ITEM QTY",
  "USE/NO USE",
  "AVAILABLE STOCK",
  "COST",
  "BOM ITEM QTY * COST",
  "ITEM TYPE",
  "MOC",
  "OPERATION",
  "SIZE",
  "NO",
  "PN-GMD",
  "CURRENT REQT",
  "NEW ITEM NAME",
  "DUPLICATE MERGER COUNT",
  "BOM NATURE",
  "CONSUMPTION-1",
  "CONSUMPTION 2",
  "CONSUMPTION 3",
] as const;

export const VERIFY_BOM_NUMERIC_COLUMNS = new Set([
  "BOM ITEM QTY",
  "AVAILABLE STOCK",
  "COST",
  "BOM ITEM QTY * COST",
  "CONSUMPTION-1",
  "CONSUMPTION 2",
  "CONSUMPTION 3",
]);

export const VERIFY_BOM_STATUS_COLUMNS = new Set([
  "BOM ID TYPE",
  "USE/NO USE",
  "BOM NATURE",
]);

/** Contract Review — the "Contract Review" sheet. */
export const CONTRACT_REVIEW_HEADERS = [
  "CONTRACT NO",
  "DATE OF CONTRACT",
  "PARTY NAME",
  "ITEM_CODE",
  "MC NO",
  "PO NO",
  "ITEM_NAME",
  "PARTY ITEM NAME",
  "RATE",
  "VALUE",
  "VA % FROM COST",
  "COST FROM QUOTATION",
  "CV",
  "VA %",
  "ORDER QTY",
  "FREE STOCK",
  "FINAL REQ",
  "MC QTY",
  "Balance mc",
  "PROD ORD QTY",
  "BALANCE TO PROD ORD",
  "BALANCE TO PROD ENT",
  "DI QTY",
  "BILLED QTY",
  "BAL BILL AG CONT",
  "BAL DI QTY",
  "BAL MC VAL",
  "BAL PROD ORD VAL",
  "BAL TO PROD ORD ENT VAL",
  "BAL BILL AG CONT VAL",
  "BAL BILL AG MC VAL",
  "BAL DI VAL",
  "DI VAL",
  "Item",
  "SIZE",
  "PN RATING",
  "CLEARANCE STATUS",
  "Actuator",
  "RM CODE FOR ACTUATOR",
  "RM CODE FOR GB",
  "PAYMENT TERMS",
  "LC/RTGS REF NO",
  "LC DATE/RTGS DATE",
  "LAST DATE OF SHIPMENT/DATE OF LC",
  "Issuing bank name",
  "bom formula trial",
  "ITEM TYPE",
  "ERP PARTY NAME FROM GMD SUPPLY HISTORY",
  "JOB Code",
  "BAL BILL AG MC",
  "ic qty",
  "BOM ID",
  "RM AVAIL",
  "STATUS",
  "MC Received/Pending",
  "Inspection",
  "OFFER PENDING/DONE",
  "Remarks",
  "STATE",
  "UTILITY",
  "PROJECT REFERENCE",
  "OFFER NUMBER",
  "INSPECTION NUMBER",
  "DI DATE",
  "ORDER LIST",
  "PROD ORDER NO",
  "Upload Drawing",
] as const;

export const CONTRACT_REVIEW_NUMERIC_COLUMNS = new Set([
  "RATE",
  "VALUE",
  "VA % FROM COST",
  "COST FROM QUOTATION",
  "CV",
  "VA %",
  "ORDER QTY",
  "FREE STOCK",
  "FINAL REQ",
  "MC QTY",
  "Balance mc",
  "PROD ORD QTY",
  "DI QTY",
  "BILLED QTY",
  "BAL DI QTY",
  "BAL MC VAL",
  "BAL PROD ORD VAL",
  "BAL TO PROD ORD ENT VAL",
  "BAL BILL AG CONT VAL",
  "BAL BILL AG MC VAL",
  "BAL DI VAL",
  "DI VAL",
  "ic qty",
  "RM AVAIL",
]);

export const CONTRACT_REVIEW_STATUS_COLUMNS = new Set([
  "PN RATING",
  "CLEARANCE STATUS",
  "STATUS",
  "MC Received/Pending",
  "Inspection",
  "OFFER PENDING/DONE",
  "STATE",
  "UTILITY",
]);

/**
 * Columns collapsed into a single parent column in the UI, mirroring the
 * grouped columns on the Quotation Process page.
 *
 * A group renders at the position of its first *visible* child in
 * CONTRACT_REVIEW_HEADERS, so visual order follows the header array rather than
 * the order groups are listed here. Declared in visual order for readability.
 */
export const CONTRACT_REVIEW_COLUMN_GROUPS: ColumnGroup[] = [
  {
    label: "Contract / PO NO",
    width: 175,
    children: [
      { header: "CONTRACT NO", label: "Contract NO -" },
      { header: "PO NO", label: "PO NO -" },
    ],
  },
  {
    label: "Item Names/Party Item Names",
    width: 200,
    children: [
      { header: "ITEM_NAME", label: "Item Name -" },
      { header: "PARTY ITEM NAME", label: "Party Item Name -" },
    ],
  },
  {
    label: "Item / Size / PN RATING",
    width: 185,
    children: [
      { header: "Item", label: "Item -" },
      { header: "SIZE", label: "Size -" },
      { header: "PN RATING", label: "PN Rating -" },
    ],
  },
  {
    label: "Actuator / RM Code for Actuator",
    width: 185,
    children: [
      { header: "Actuator", label: "Actuator -" },
      { header: "RM CODE FOR ACTUATOR", label: "RM Code for Actuator -" },
    ],
  },
  {
    label: "LC / RTGS / Issuing bank name",
    width: 420,
    children: [
      { header: "LC/RTGS REF NO", label: " LC/RTGSRef No -" },
      { header: "LC DATE/RTGS DATE", label: "LC Date -" },
      {
        header: "LAST DATE OF SHIPMENT/DATE OF LC",
        label: "Ship Date Of LC -",
      },
      { header: "Issuing bank name", label: "Issuing Bank Name -" },
    ],
  },
];

/**
 * Default rendered width in px for the standalone Contract Review columns.
 * Only columns whose widest content differs from the table's generic 180px
 * default need an entry; the 5 collapsed groups are sized by `width` on
 * CONTRACT_REVIEW_COLUMN_GROUPS above, which takes precedence.
 */
export const CONTRACT_REVIEW_COLUMN_WIDTHS: Record<string, number> = {
  "DATE OF CONTRACT": 150,
  "DI DATE": 150,
  "MC NO": 110,
  "ic qty": 100,
  "ITEM_CODE": 130,
  "JOB Code": 120,
  "BOM ID": 130,
  "RM CODE FOR GB": 130,
  "PROD ORDER NO": 150,
  "OFFER NUMBER": 140,
  "INSPECTION NUMBER": 150,
  CV: 100,
  "VA %": 80,
  RATE: 90,
  "ORDER QTY": 100,
  "FREE STOCK": 110,
  "FINAL REQ": 110,
  "MC QTY": 110,
  "DI QTY": 110,
  "DI VAL": 110,
  "RM AVAIL": 110,
  "BAL DI VAL": 120,
  "BAL MC VAL": 120,
  VALUE: 95,
  "Balance mc": 120,
  "PROD ORD QTY": 120,
  "BILLED QTY": 120,
  "BAL DI QTY": 120,
  STATE: 110,
  UTILITY: 110,
  "ITEM TYPE": 120,
  "VA % FROM COST": 100,
  "COST FROM QUOTATION": 150,
  "BAL BILL AG CONT": 100,
  "BAL BILL AG MC": 140,
  "BAL PROD ORD VAL": 145,
  "BALANCE TO PROD ORD": 150,
  "BALANCE TO PROD ENT": 150,
  "BAL BILL AG MC VAL": 155,
  "BAL BILL AG CONT VAL": 160,
  "BAL TO PROD ORD ENT VAL": 165,
  STATUS: 140,
  Inspection: 140,
  "CLEARANCE STATUS": 130,
  "OFFER PENDING/DONE": 150,
  "MC Received/Pending": 160,
  "ORDER LIST": 160,
  "PAYMENT TERMS": 180,
  "PROJECT REFERENCE": 200,
  "Upload Drawing": 100,
  Remarks: 220,
  "PARTY NAME": 240,
  "ERP PARTY NAME FROM GMD SUPPLY HISTORY": 280,
  "bom formula trial": 300,
};

/** Supply History — the "MASTER" sheet. */
export const SUPPLY_HISTORY_HEADERS = [
  "item name",
  "INVOICE NO",
  "FINANCIAL YEAR",
  "party name",
  "ERP PARTY NAME",
  "Date",
  "PARTY Order No.",
  "PARTY Date",
  "Quantity",
  "UOM",
  "Value",
  "Gross Total- INVOICE VALUE",
  "LR NO & DT",
  "DELIVERY DESTINATION",
  "CONSIGNEE ADDRESS",
  "CONSIGNEE NAME",
  "ERP CONTRACT NO",
  "ERP ITEM CODE",
  "TYPE OF VALVE",
  "SIZE OF VALVE",
  "CLASS OF VALVE",
  "SPARES (TYPE)",
  "MOC",
  "ORDER COPY",
  "INVOICE",
  "INSPECTION REPORT",
  "State",
  "UTILITY",
  "performance certificate",
  "service period complete",
  "WARRANTY VALID TILL AS PER CONTRACT",
  "Warranty valid/Not",
  "BG NO",
  "PBG VALID TILL",
  "as per order warranty period",
  "PBG CLAIM TILL",
  "PBG AMOUNT",
  "Warranty Exp Date as Per Inv",
  "Party Mail Address",
  "Item Type",
  "MOC",
  "Size",
  "ORDER LIST",
] as const;

export const SUPPLY_HISTORY_NUMERIC_COLUMNS = new Set([
  "Quantity",
  "Value",
  "Gross Total- INVOICE VALUE",
  "PBG AMOUNT",
]);

export const SUPPLY_HISTORY_STATUS_COLUMNS = new Set([
  "Warranty valid/Not",
  "State",
  "UTILITY",
  "Item Type",
]);

export const SUPPLY_HISTORY_COLUMN_WIDTHS: Record<string, number> = {
  "item name": 240,
  "Party Mail Address": 300,
  "ORDER LIST": 160,
  "CONSIGNEE ADDRESS": 260,
  "party name": 220,
  "ERP PARTY NAME": 220,
  "WARRANTY VALID TILL AS PER CONTRACT": 190,
  "as per order warranty period": 180,
  "service period complete": 160,
};

/** BIS Status. */
export const BIS_STATUS_HEADERS = [
  "itemName",
  "bisNo",
  "licenseNo",
  "expiryDate",
  "applicationStatus",
  "remark",
  "reachedLab",
] as const;

export const BIS_STATUS_NUMERIC_COLUMNS = new Set<string>([]);

export const BIS_STATUS_STATUS_COLUMNS = new Set([
  "applicationStatus",
  "reachedLab",
]);

export const BIS_STATUS_COLUMN_WIDTHS: Record<string, number> = {
  itemName: 260,
  bisNo: 160,
  licenseNo: 180,
  expiryDate: 130,
  applicationStatus: 150,
  remark: 220,
  reachedLab: 180,
};

/** Physical Stock — the "stock-phys" sheet. */
export const PHYSICAL_STOCK_HEADERS = [
  "ERP CODE",
  "location",
  "L2-VALVE TYPE",
  "DIMENSION",
  "L7-DIMENSION",
  "L4-COMPONENT",
  "L5- MATERIAL",
  "L6-STD",
  "L8 -ITEM CATEGORY",
  "RECEIVED QTY.",
  "DISPATCH QTY.",
  "AVAILABLE QTY.",
  "REMARKS",
  "sum of PHYSICAL stock",
  "stock as per erp",
  "rate/unit",
  "rate per pc*qty*weight",
  "weight per pc",
  "item wise-value",
  "MOVING WITHIN 3 MONTHS",
  "Order Ag Approval recvd",
  "PURCHASE IN 26-27",
  "dispatched in 26-27",
  "ORDER IN hand QTY",
  "shortage qty",
  "item type",
  "PRICE",
  "MOQ",
  "IF LESS THAN MOQ- EXTRA CHARGES",
  "DRAWING/ TECHNICAL DATA",
] as const;

export const PHYSICAL_STOCK_NUMERIC_COLUMNS = new Set([
  "RECEIVED QTY.",
  "DISPATCH QTY.",
  "AVAILABLE QTY.",
  "sum of PHYSICAL stock",
  "stock as per erp",
  "rate/unit",
  "rate per pc*qty*weight",
  "weight per pc",
  "item wise-value",
  "PURCHASE IN 26-27",
  "dispatched in 26-27",
  "ORDER IN hand QTY",
  "shortage qty",
  "PRICE",
  "MOQ",
]);

export const PHYSICAL_STOCK_STATUS_COLUMNS = new Set<string>([]);

export const PHYSICAL_STOCK_COLUMN_WIDTHS: Record<string, number> = {
  "ERP CODE": 150,
  REMARKS: 220,
  "DRAWING/ TECHNICAL DATA": 220,
  "IF LESS THAN MOQ- EXTRA CHARGES": 200,
};
