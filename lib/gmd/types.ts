import type { EngineeringTab } from "./tableConfig";

/**
 * An item drawing/photo linked to a Contract Review item code.
 *
 * Populated in Phase 2 from Google Drive. Until then the gallery dialog renders
 * its empty state, which is why the type is optional on the table props rather
 * than required.
 */
export type ItemImage = {
  /** Stable key used as a React key and shown as the fallback caption. */
  imageKey: string;
  /** Public or signed URL. Preferred over `driveFileId` when both are present. */
  url?: string | null;
  /** Drive file id, used for the thumbnail and to build a `drive.google.com` link. */
  driveFileId?: string | null;
  itemType?: string | null;
  operationType?: string | null;
  rmType?: string | null;
};

/** One subtab's data, in the shape the table consumes. */
export type EngineeringTableData = {
  headers: string[];
  rows: unknown[][];
  /** Row ids, parallel to `rows`. */
  ids: string[];
  /**
   * ISO timestamp of the last successful sheet sync.
   *
   * `undefined` means "no source wired up yet" and `GMDUpdateHeader` hides the
   * readout entirely; `null` means a source exists but has never synced.
   */
  syncedAt?: string | null;
  totalRows: number;
};

export type EngineeringDataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: EngineeringTableData };

export type { EngineeringTab };
