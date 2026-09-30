import type { EngineeringTab } from "./tableConfig";

/**
 * Placeholder rows for the Engineering Data tables.
 *
 * Phase 1 ships the UI only — the Google Sheets fetch lands in Phase 2 — so the
 * tables need something real to render. These generators are deterministic
 * (no Math.random, no Date.now at module scope) so a server render and a client
 * render of the same tab always agree, and so `next build` output is stable.
 *
 * Each generator walks the tab's own `headers` array and fills by caption, so
 * adding a column to a tab needs no edit here — unknown captions fall through to
 * a generic value rather than misaligning the row.
 */

type Row = unknown[];

/** Rows generated per tab. Enough to exercise pagination past page 1 at size 25. */
export const PLACEHOLDER_ROW_COUNT = 64;

/* -------------------------------------------------------------------------- */
/* Deterministic pseudo-randomness                                            */
/* -------------------------------------------------------------------------- */

/** Mulberry32 — small, fast, and stable across runs given the same seed. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: () => number, items: readonly T[]): T =>
  items[Math.floor(rand() * items.length) % items.length];

const int = (rand: () => number, min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

/** Leaves roughly 1 in 7 values empty so blank filters have something to match. */
const maybeBlank = (rand: () => number, value: string | number): string | number =>
  rand() < 0.14 ? "" : value;

/* -------------------------------------------------------------------------- */
/* Vocabularies                                                                */
/* -------------------------------------------------------------------------- */

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** `dd-Mmm-yyyy`, the format the date parser and date-range filters expect. */
function gmdDate(rand: () => number, minYear = 2021, maxYear = 2027) {
  const d = int(rand, 1, 28);
  const m = pick(rand, MONTH_ABBR);
  const y = int(rand, minYear, maxYear);
  return `${String(d).padStart(2, "0")}-${m}-${y}`;
}

const ISO_DAYS = [
  "2024-01-12", "2024-03-04", "2024-06-19", "2024-09-27", "2025-01-08",
  "2025-04-22", "2025-07-15", "2025-10-30", "2026-02-17", "2026-05-06",
  "2026-08-21", "2027-01-11",
];

const VALVE_TYPES = [
  "BALL", "GATE", "GLOBE", "CHECK", "BUTTERFLY", "PLUG", "DIAPHRAGM", "SLUICE",
] as const;

const COMPONENTS = [
  "BODY", "BONNET", "DISC", "SEAT RING", "STEM", "HANDLE", "YOKE", "PACKING",
  "GASKET", "BOLT", "NUT", "TRIM",
] as const;

const MATERIALS = [
  "WCB", "CF8M", "SS304", "SS316L", "F51", "F53", "BRZ", "DUPLEX",
] as const;

const STD_SIZES = ["1/2\"", "3/4\"", "1\"", "2\"", "3\"", "4\"", "6\"", "8\""] as const;

const CATEGORIES = [
  "VALVE", "ACTUATOR", "SPARE", "CONSUMABLE", "FASTENER", "SEAL",
] as const;

const MOC = [
  "WCB", "CF8M", "SS316", "MS", "Brass", "Copper",
] as const;

const UM = ["NOS", "KG", "MTR", "SET", "PC"] as const;

const PARTY_NAMES = [
  "ADANI POWER LIMITED",
  "BHEL",
  "INDIAN OIL CORPORATION LIMITED",
  "NTPC LIMITED",
  "TATA POWER",
  "GAIL INDIA LIMITED",
  "THERMAX LIMITED",
  "JSW STEEL LIMITED",
  "HINDUSTAN PETROLEUM CORPORATION LIMITED",
  "ONGC",
  "COAL INDIA LIMITED",
  "RAILTEL POWER LIMITED",
];

const PROJECT_STATES = [
  "Gujarat", "Maharashtra", "Tamil Nadu", "Karnataka", "West Bengal",
  "Uttar Pradesh", "Odisha", "Kerala", "Rajasthan", "Telangana",
] as const;

const UTILITIES = [
  "POWER", "WATER", "OIL & GAS", "STEEL", "FERTILISER", "CEMENT", "MINING",
] as const;

const ITEM_TYPES = ["2:1", "3:1", "DIRECT M2M", "CREATE BOM", "SPARE"] as const;

const USE_NO_USE = ["USE", "NO USE"] as const;

const BOM_NATURES = ["NEW BOM", "EXISTING BOM", "REVISED BOM"] as const;

const STATUS_WORDS = [
  "APPROVED", "PENDING", "REJECTED", "ACTIVE", "INACTIVE", "NEW", "DRAFT",
  "SUBMITTED", "REVIEW",
];

const INDIAN_IMPORTED = ["INDIAN", "IMPORTED"] as const;

const YES_NO = ["true", "false"] as const;

const BOM_ID_TYPES = ["2:1", "3:1", "DIRECT M2M", "CREATE BOM"] as const;

const LICENCE_STATUS = [
  "APPROVED", "PENDING", "REJECTED", "UNDER TEST", "APPLIED",
] as const;

const LABS = [
  "BIS - REREC", "BIS - ABER", "BIS - CMI", "BIS - ETI", "BIS - SGS",
] as const;

const STOCK_LOCATIONS = [
  "BHARAT-01", "BHARAT-02", "BALLABHAD", "KALOL", "PUNE", "JAMNAGAR",
] as const;

const MOVEMENT = ["YES", "NO"] as const;

const WARRANTY_VALID = ["VALID", "EXPIRED", "PENDING", "NOT APPLICABLE"] as const;

/* -------------------------------------------------------------------------- */
/* Per-caption value builders                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Returns a value for a single cell, or `undefined` to leave it blank.
 *
 * A builder returning `undefined` is the signal for "this caption has no
 * meaningful placeholder", which the caller turns into an empty cell so blank
 * filters stay honest.
 */
type CellBuilder = (
  header: string,
  rowIndex: number,
  rand: () => number,
  row: Row,
) => string | number | undefined;

/** Derives a stable ERP item code from a row index. */
const erpCode = (i: number) => `GMD-${String(10000 + i * 7).slice(0, 5)}`;

const rawMaterialCell: CellBuilder = (header, i, rand) => {
  const valve = pick(rand, VALVE_TYPES);
  const dia = pick(rand, STD_SIZES);
  const comp = pick(rand, COMPONENTS);
  const mat = pick(rand, MATERIALS);
  const item = `GMD-${erpCode(i)}`;
  switch (header) {
    case "ERP ITEM CODE":
      return i % 11 === 0 ? "" : item;
    case "ITEM NAME (proposed)-AUTO":
      return `${valve} ${comp} ${dia} ${mat}`;
    case "L1":
      return "VALVE";
    case "L2-VALVE TYPE":
      return valve;
    case "L3-DIA":
      return dia;
    case "L7-DIMENSION":
      return `DN${int(rand, 15, 600)}`;
    case "L4-COMPONENT":
      return comp;
    case "L5- MATERIAL":
      return mat;
    case "L6-STD":
      return pick(rand, STD_SIZES);
    case "L8 -ITEM CATEGORY":
      return pick(rand, CATEGORIES);
    case "UM":
      return pick(rand, UM);
    case "Available Stock":
      return int(rand, 0, 4000);
    case "CONV":
      return "";
    case "1 pcs wgt":
      return Number((rand() * 240 + 0.4).toFixed(2));
    case "AUM":
      return pick(rand, UM);
    case "cost":
      return Number((rand() * 18000 + 120).toFixed(2));
    case "USD cost":
      return Number((rand() * 420 + 4).toFixed(2));
    case "HSN CODE":
      return `${int(rand, 7307, 8481)}10`;
    case "HSN Code Validation":
      return pick(rand, YES_NO);
    case "MAJOR MARKING":
      return pick(rand, YES_NO);
    case "NEW ITEM STATUS":
      return pick(rand, ["Updated", "New", "Pending"]);
    case "CURRENT STATUS":
      return pick(rand, STATUS_WORDS);
    case "RM TYPE":
      return pick(rand, ["1538", "9523", "ANSI", "COMMON", "CAP", "CONS"]);
    case "INDIAN/IMPORTED":
      return pick(rand, INDIAN_IMPORTED);
    case "Order Qty":
      return int(rand, 0, 900);
    default:
      return undefined;
  }
};

const verifyBomCell: CellBuilder = (header, i, rand, row) => {
  // Rows are generated in groups of 3 per BOM, and everything that identifies
  // the BOM — id, item code, id type, name — is derived from the group index
  // rather than the per-row RNG. The table merges each group onto one row-spanning
  // block, so anything randomised per row would stop the run from ever merging.
  const groupIndex = Math.floor(i / 3);
  const groupRand = rng(seedFor("verify-bom") + groupIndex * 7919);
  const bomId = `BOM-${String(5000 + groupIndex * 13).slice(0, 4)}-${pick(groupRand, ["A", "B", "C"])}`;
  const itemCode = erpCode(groupIndex);
  const type = pick(groupRand, BOM_ID_TYPES);
  const qty = int(groupRand, 1, 60);
  const cost = Number((groupRand() * 9000 + 80).toFixed(2));
  switch (header) {
    case "BOM ID":
      return bomId;
    case "ITEM CODE":
      return itemCode;
    case "ITEM NAME":
      return `${pick(groupRand, VALVE_TYPES)} ${pick(groupRand, COMPONENTS)} ${pick(groupRand, STD_SIZES)}`;
    case "ITEM SCHEDULE NAME":
      return `Schedule ${int(groupRand, 1, 9)}`;
    case "RM ITEM CODE":
      return `RM-${String(40000 + i * 3).slice(0, 5)}`;
    case "RM ITEM NAME":
      return `${pick(groupRand, COMPONENTS)} ${pick(groupRand, MATERIALS)}`;
    case "BOM ID TYPE":
      return type;
    case "BOM ITEM QTY":
      return qty;
    case "USE/NO USE":
      return pick(groupRand, USE_NO_USE);
    case "AVAILABLE STOCK":
      return int(groupRand, 0, 2500);
    case "COST":
      return cost;
    case "BOM ITEM QTY * COST":
      return Number((qty * cost).toFixed(2));
    case "ITEM TYPE":
      return pick(groupRand, ITEM_TYPES);
    case "MOC":
      return pick(groupRand, MOC);
    case "OPERATION":
      return maybeBlank(rand, pick(groupRand, ["Ball", "Butterfly", "Plug"]));
    case "SIZE":
      return pick(groupRand, STD_SIZES);
    case "NO":
      return String(i + 1).padStart(3, "0");
    case "PN-GMD":
      return `PN-${int(groupRand, 100, 999)}`;
    case "CURRENT REQT":
      return int(groupRand, 0, 400);
    case "NEW ITEM NAME":
      return rand() < 0.5 ? "" : `${pick(groupRand, COMPONENTS)} (rev B)`;
    case "DUPLICATE MERGER COUNT":
      return int(groupRand, 0, 6);
    case "BOM NATURE":
      return pick(groupRand, BOM_NATURES);
    case "CONSUMPTION-1":
      return Number((groupRand() * 4 + 0.5).toFixed(2));
    case "CONSUMPTION 2":
      return Number((groupRand() * 4 + 0.5).toFixed(2));
    case "CONSUMPTION 3":
      return maybeBlank(rand, Number((groupRand() * 4 + 0.5).toFixed(2)));
    default:
      void row;
      return undefined;
  }
};

const contractReviewCell: CellBuilder = (header, i, rand) => {
  const party = pick(rand, PARTY_NAMES);
  const rate = Number((rand() * 42000 + 900).toFixed(2));
  const orderQty = int(rand, 5, 400);
  const billed = Math.min(orderQty, int(rand, 0, orderQty));
  const orderList = [1, 2]
    .map(
      (_, n) =>
        `https://drive.google.com/file/d/${String(1000 + i * 11 + n * 7)}/view`,
    )
    .slice(0, rand() < 0.5 ? 1 : 2)
    .join(", ");
  switch (header) {
    case "CONTRACT NO":
      return `GMD/CON/26-27/${String(1200 + i).slice(-4)}`;
    case "DATE OF CONTRACT":
      return rand() < 0.12 ? "" : gmdDate(rand, 2024, 2026);
    case "PARTY NAME":
      return party;
    case "ITEM_CODE":
      return erpCode(i);
    case "MC NO":
      return `MC/${int(rand, 1000, 9999)}`;
    case "PO NO":
      return `PO/${int(rand, 100000, 999999)}`;
    case "ITEM_NAME":
      return `${pick(rand, VALVE_TYPES)} ${pick(rand, COMPONENTS)} ${pick(rand, STD_SIZES)}`;
    case "PARTY ITEM NAME":
      return `Party ${pick(rand, COMPONENTS)} ${pick(rand, STD_SIZES)}`;
    case "RATE":
      return rate;
    case "VALUE":
      return Number((rate * orderQty).toFixed(2));
    case "VA % FROM COST":
      return `${int(rand, 5, 28)}%`;
    case "COST FROM QUOTATION":
      return Number((rate * (0.6 + rand() * 0.25)).toFixed(2));
    case "CV":
      return Number((rand() * 6 + 0.2).toFixed(2));
    case "VA %":
      return `${int(rand, 4, 22)}%`;
    case "ORDER QTY":
      return orderQty;
    case "FREE STOCK":
      return int(rand, 0, 200);
    case "FINAL REQ":
      return int(rand, 0, 200);
    case "MC QTY":
      return int(rand, 0, orderQty);
    case "Balance mc":
      return int(rand, 0, orderQty);
    case "PROD ORD QTY":
      return int(rand, 0, orderQty);
    case "BALANCE TO PROD ORD":
    case "BALANCE TO PROD ENT":
    case "BAL DI QTY":
    case "BAL DI VAL":
    case "DI QTY":
    case "DI VAL":
    case "ic qty":
    case "RM AVAIL":
    case "BAL MC VAL":
    case "BAL PROD ORD VAL":
    case "BAL TO PROD ORD ENT VAL":
    case "BAL BILL AG CONT VAL":
    case "BAL BILL AG MC VAL":
      return Number((rand() * 50000).toFixed(2));
    case "BILLED QTY":
      return billed;
    case "BAL BILL AG CONT":
    case "BAL BILL AG MC":
      return int(rand, 0, orderQty);
    case "Item":
      return pick(rand, VALVE_TYPES);
    case "SIZE":
      return pick(rand, STD_SIZES);
    case "PN RATING":
      return pick(rand, ["PN10", "PN16", "PN20", "PN25", "PN40", "CL150"]);
    case "CLEARANCE STATUS":
      return pick(rand, ["CLEARED", "PENDING", "REJECTED"]);
    case "Actuator":
      return maybeBlank(rand, pick(rand, ["HANDWHEEL", "GEARBOX", "PNEUMATIC", "ELECTRIC"]));
    case "RM CODE FOR ACTUATOR":
    case "RM CODE FOR GB":
      return `RM-${String(70000 + i * 5).slice(0, 5)}`;
    case "PAYMENT TERMS":
      return pick(rand, ["30 DAYS CREDIT", "45 DAYS CREDIT", "100% ADVANCE", "LC AT SIGHT"]);
    case "LC/RTGS REF NO":
      return `LC${int(rand, 100000, 999999)}`;
    case "LC DATE/RTGS DATE":
    case "LAST DATE OF SHIPMENT/DATE OF LC":
    case "DI DATE":
      return pick(rand, ISO_DAYS);
    case "Issuing bank name":
      return pick(rand, ["SBI", "HDFC BANK", "ICICI BANK", "AXIS BANK", "PNB"]);
    case "bom formula trial":
      return `${int(rand, 2, 9)} x ${int(rand, 2, 9)} x ${int(rand, 2, 9)} = ${int(rand, 20, 700)}`;
    case "ITEM TYPE":
      return pick(rand, ITEM_TYPES);
    case "ERP PARTY NAME FROM GMD SUPPLY HISTORY":
      return party.replace(/\s+(LIMITED|LTD\.?)$/i, "");
    case "JOB Code":
      return `JOB/${int(rand, 100, 999)}`;
    case "BOM ID":
      return `BOM-${String(5000 + i).slice(-4)}`;
    case "STATUS":
      return pick(rand, STATUS_WORDS);
    case "MC Received/Pending":
      return pick(rand, ["RECEIVED", "PENDING", "PARTIAL"]);
    case "Inspection":
      return pick(rand, ["PASSED", "PENDING", "FAILED", "NOT REQUIRED"]);
    case "OFFER PENDING/DONE":
      return pick(rand, ["PENDING", "DONE"]);
    case "Remarks":
      return maybeBlank(rand, pick(rand, [
        "Awaiting client drawing approval",
        "Price revised per negotiation",
        "Material received in full",
        "Balance to be supplied in next lot",
      ]));
    case "STATE":
      return pick(rand, PROJECT_STATES);
    case "UTILITY":
      return pick(rand, UTILITIES);
    case "PROJECT REFERENCE":
      return `PRJ-${int(rand, 1000, 9999)}`;
    case "OFFER NUMBER":
      return `ID${pick(rand, ["24", "25", "26"])}Y-${int(rand, 10, 99)}`;
    case "INSPECTION NUMBER":
      return `INS/${int(rand, 10000, 99999)}`;
    case "ORDER LIST":
      return orderList;
    case "PROD ORDER NO":
      return `PRON/${int(rand, 10000, 99999)}`;
    default:
      return undefined;
  }
};

const supplyHistoryCell: CellBuilder = (header, i, rand) => {
  const qty = int(rand, 1, 200);
  const value = Number((rand() * 900000 + 5000).toFixed(2));
  switch (header) {
    case "item name":
      return `${pick(rand, VALVE_TYPES)} ${pick(rand, COMPONENTS)} ${pick(rand, STD_SIZES)}`;
    case "INVOICE NO":
      return `GMD/26-27/${String(3000 + i).slice(-4)}`;
    case "FINANCIAL YEAR":
      return pick(rand, ["2023-24", "2024-25", "2025-26", "2026-27"]);
    case "party name":
    case "ERP PARTY NAME":
      return pick(rand, PARTY_NAMES);
    case "Date":
      return gmdDate(rand, 2023, 2026);
    case "PARTY Order No.":
      return `PON/${int(rand, 100000, 999999)}`;
    case "PARTY Date":
      return gmdDate(rand, 2023, 2026);
    case "Quantity":
      return qty;
    case "UOM":
      return pick(rand, UM);
    case "Value":
      return value;
    case "Gross Total- INVOICE VALUE":
      return Number((value + value * 0.18).toFixed(2));
    case "LR NO & DT":
      return `LR/${int(rand, 100000, 999999)} dt ${gmdDate(rand, 2023, 2026)}`;
    case "DELIVERY DESTINATION":
      return `${pick(rand, PROJECT_STATES)} - ${pick(rand, ["PLANT", "SITE", "STORE"])}`;
    case "CONSIGNEE ADDRESS":
      return `Plot ${int(rand, 1, 200)}, ${pick(rand, ["GIDC", "MIDC", "AIE"])} Estate, ${pick(rand, PROJECT_STATES)}`;
    case "CONSIGNEE NAME":
      return pick(rand, PARTY_NAMES);
    case "ERP CONTRACT NO":
      return `GMD/CON/26-27/${String(1200 + i).slice(-4)}`;
    case "ERP ITEM CODE":
      return erpCode(i);
    case "TYPE OF VALVE":
    case "Item Type":
      return pick(rand, VALVE_TYPES);
    case "SIZE OF VALVE":
    case "Size":
      return pick(rand, STD_SIZES);
    case "CLASS OF VALVE":
      return pick(rand, ["150", "300", "600", "900", "1500"]);
    case "SPARES (TYPE)":
      return maybeBlank(rand, pick(rand, ["SEAL KIT", "GEARBOX KIT", "DISC SET", "STEM"]));
    case "MOC":
      return pick(rand, MOC);
    case "ORDER COPY":
      return `https://drive.google.com/file/d/${String(2000 + i * 9)}/view`;
    case "INVOICE":
      return `https://drive.google.com/file/d/${String(3000 + i * 9)}/view`;
    case "INSPECTION REPORT":
      return `https://drive.google.com/file/d/${String(4000 + i * 9)}/view`;
    case "State":
      return pick(rand, PROJECT_STATES);
    case "UTILITY":
      return pick(rand, UTILITIES);
    case "performance certificate":
      return pick(rand, YES_NO);
    case "service period complete":
      return pick(rand, YES_NO);
    case "WARRANTY VALID TILL AS PER CONTRACT":
      return gmdDate(rand, 2025, 2029);
    case "Warranty valid/Not":
      return pick(rand, WARRANTY_VALID);
    case "BG NO":
      return `BG${int(rand, 100000, 999999)}`;
    case "PBG VALID TILL":
    case "PBG CLAIM TILL":
      return gmdDate(rand, 2025, 2029);
    case "as per order warranty period":
      return pick(rand, ["12 MONTHS", "18 MONTHS", "24 MONTHS", "36 MONTHS"]);
    case "PBG AMOUNT":
      return Number((value * 0.03).toFixed(2));
    case "Warranty Exp Date as Per Inv":
      return gmdDate(rand, 2025, 2030);
    case "Party Mail Address":
      return `contracts@${pick(rand, ["adani", "ntpc", "gail", "tata", "onl"])}.example.in`;
    case "ORDER LIST":
      return `https://drive.google.com/file/d/${String(5000 + i * 9)}/view`;
    default:
      return undefined;
  }
};

const bisStatusCell: CellBuilder = (header, i, rand) => {
  switch (header) {
    case "itemName":
      return `${pick(rand, VALVE_TYPES)} ${pick(rand, COMPONENTS)} ${pick(rand, STD_SIZES)}`;
    case "bisNo":
      return `BIS/26/${String(4000 + i).slice(-4)}`;
    case "licenseNo":
      return maybeBlank(rand, `LIC-${int(rand, 100000, 999999)}`);
    case "expiryDate":
      return gmdDate(rand, 2026, 2031);
    case "applicationStatus":
      return pick(rand, LICENCE_STATUS);
    case "remark":
      return maybeBlank(rand, pick(rand, [
        "Test sample withdrawn for retest",
        "Awaiting third-party test report",
        "Design modified, re-lodgement required",
      ]));
    case "reachedLab":
      return pick(rand, LABS);
    default:
      return undefined;
  }
};

const physicalStockCell: CellBuilder = (header, i, rand) => {
  const received = int(rand, 0, 900);
  const dispatched = Math.min(received, int(rand, 0, 700));
  switch (header) {
    case "ERP CODE":
      return erpCode(i);
    case "location":
      return pick(rand, STOCK_LOCATIONS);
    case "L2-VALVE TYPE":
      return pick(rand, VALVE_TYPES);
    case "DIMENSION":
    case "L7-DIMENSION":
      return `DN${int(rand, 15, 600)}`;
    case "L4-COMPONENT":
      return pick(rand, COMPONENTS);
    case "L5- MATERIAL":
      return pick(rand, MATERIALS);
    case "L6-STD":
      return pick(rand, STD_SIZES);
    case "L8 -ITEM CATEGORY":
      return pick(rand, CATEGORIES);
    case "RECEIVED QTY.":
      return received;
    case "DISPATCH QTY.":
      return dispatched;
    case "AVAILABLE QTY.":
      return received - dispatched;
    case "REMARKS":
      return maybeBlank(rand, pick(rand, [
        "Reconciliation pending with ERP",
        "Held for warranty replacement",
        "Surplus, offer to project",
      ]));
    case "sum of PHYSICAL stock":
      return received - dispatched;
    case "stock as per erp":
      return Math.max(0, received - dispatched + int(rand, -40, 40));
    case "rate/unit":
      return Number((rand() * 12000 + 60).toFixed(2));
    case "rate per pc*qty*weight":
    case "item wise-value":
      return Number((rand() * 900000).toFixed(2));
    case "weight per pc":
      return Number((rand() * 220 + 0.3).toFixed(2));
    case "MOVING WITHIN 3 MONTHS":
    case "Order Ag Approval recvd":
      return pick(rand, MOVEMENT);
    case "PURCHASE IN 26-27":
    case "dispatched in 26-27":
    case "ORDER IN hand QTY":
    case "shortage qty":
      return int(rand, 0, 500);
    case "item type":
      return pick(rand, ITEM_TYPES);
    case "PRICE":
      return Number((rand() * 18000 + 90).toFixed(2));
    case "MOQ":
      return pick(rand, [10, 25, 50, 100, 200]);
    case "IF LESS THAN MOQ- EXTRA CHARGES":
      return maybeBlank(rand, "APPLICABLE");
    case "DRAWING/ TECHNICAL DATA":
      return maybeBlank(rand, `https://drive.google.com/file/d/${String(6000 + i * 9)}/view`);
    default:
      return undefined;
  }
};

/** Which builder fills which tab. */
const BUILDERS: Record<string, CellBuilder> = {
  "raw-material": rawMaterialCell,
  "verify-bom": verifyBomCell,
  "contract-review": contractReviewCell,
  "supply-history": supplyHistoryCell,
  "bis-status": bisStatusCell,
  "physical-stock": physicalStockCell,
};

/**
 * Stable per-tab seed, so switching tabs back and forth does not reshuffle the
 * rows and lose a user's place in a filtered list.
 */
function seedFor(tabKey: string): number {
  let h = 0;
  for (let i = 0; i < tabKey.length; i++) {
    h = (Math.imul(31, h) + tabKey.charCodeAt(i)) | 0;
  }
  return Math.abs(h) + 1;
}

function generateRows(tab: EngineeringTab, count: number): Row[] {
  const build = BUILDERS[tab.key];
  if (!build) return [];

  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const rand = rng(seedFor(tab.key) + i * 7919);
    const row: Row = new Array(tab.headers.length).fill("");
    tab.headers.forEach((header, colIdx) => {
      const value = build(header, i, rand, row);
      if (value !== undefined) row[colIdx] = value;
    });
    rows.push(row);
  }
  return rows;
}

/** Cache per tab so switching tabs does not regenerate the same rows. */
const cache = new Map<string, Row[]>();

export function getPlaceholderRows(tab: EngineeringTab): Row[] {
  const cached = cache.get(tab.key);
  if (cached) return cached;
  const rows = generateRows(tab, PLACEHOLDER_ROW_COUNT);
  cache.set(tab.key, rows);
  return rows;
}

/**
 * Stable row ids, parallel to the row arrays. The table keys rows and carries
 * selection on them, so it needs an id per row even when nothing is editable.
 */
export function getPlaceholderIds(tab: EngineeringTab, rows: Row[]): string[] {
  return rows.map((_, i) => `${tab.key}:${i}`);
}
