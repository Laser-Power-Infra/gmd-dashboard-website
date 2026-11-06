import { getAccessToken } from "@/lib/googleAuth";
import { sheetFieldCount } from "./engineeringModels";
import type { EngineeringTab } from "./types";

/**
 * Reads one tab of "GMD Technical Master Data" into positional rows.
 *
 * This is now **sync-time only** — `lib/gmd/syncEngineering.ts` is its sole
 * caller. The public read path serves the UI from Postgres, so a browser
 * request never touches Google.
 *
 * Server-only: it holds an OAuth access token, so it must not be imported from a
 * `"use client"` module.
 *
 * Uses `fetch` against the REST endpoint rather than the `googleapis` package,
 * which is ~100 MB to serve one endpoint.
 */

/** The workbook id. Not a secret — it is in the sheet's URL. */
const SPREADSHEET_ID = "14g8fhJEB6vQx4tkfC6t38-WWRoeUBTM04E5c-ebmzLs";

type SheetsValuesResponse = {
  range?: string;
  majorDimension?: string;
  values?: (string | number | boolean | null)[][];
};

/**
 * Rows are padded/truncated to the tab's **sheet-backed** column count (see
 * `sheetColumnCount`) so a short row cannot shift cells leftwards, and
 * entirely-empty rows (the sheet has thousands of trailing blank grid rows) are
 * dropped. App-managed columns are not part of this width at all.
 */
export async function fetchEngineeringSheet(
  tab: EngineeringTab,
): Promise<{ headers: string[]; rows: unknown[][] }> {
  const accessToken = await getAccessToken();

  // `encodeURIComponent` leaves `'` and `!` alone — exactly what A1 notation
  // needs (`'GATE VALVE'!A2:T`) — while encoding the space and the colon.
  const range = `'${tab.sheetName}'!${tab.dataRange}`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/` +
    `${encodeURIComponent(range)}?valueRenderOption=FORMATTED_VALUE`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Google Sheets request for "${tab.sheetName}" failed (${res.status}). ` +
        (body ? body.slice(0, 300) : "No response body."),
    );
  }

  const json = (await res.json()) as SheetsValuesResponse;
  const columnCount = sheetFieldCount(tab.key);
  const rows: unknown[][] = [];

  for (const rawRow of json.values ?? []) {
    const row: unknown[] = new Array(columnCount).fill("");
    let hasValue = false;
    for (let i = 0; i < columnCount; i++) {
      const cell = rawRow[i];
      const value = cell == null ? "" : String(cell).trim();
      row[i] = value;
      if (value !== "") hasValue = true;
    }
    if (!hasValue) continue;
    rows.push(row);
  }

  return { headers: [...tab.columns], rows };
}
