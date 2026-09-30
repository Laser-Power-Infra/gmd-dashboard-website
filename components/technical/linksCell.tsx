/**
 * URL detection and comma-separated link rendering for table cells.
 *
 * Several sheets store multiple links in one cell as a comma-separated list (the
 * Supply History `ORDER LIST` column, the Contract Review order-copy columns).
 * Splitting on commas is what lets a single cell render as a list of anchors
 * rather than one broken link.
 */
import { toast } from "sonner";

export function isUrl(text: string): boolean {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Splits a cell into its individual links, dropping anything that is not a URL. */
export function parseLinks(cell: string): string[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(isUrl);
}

/**
 * Renders a mixed list of links and plain text. Returns null when the cell holds
 * no links at all, so the caller can fall back to a plain text cell.
 */
export function renderLinksCell(display: string) {
  const parts = display
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  const linkParts = parts.filter(isUrl);
  if (linkParts.length === 0) return null;
  return (
    <span className="block break-all" title={display}>
      {parts.map((part, idx) => (
        <span key={`${part}-${idx}`}>
          {isUrl(part) ? (
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          ) : (
            <span>{part}</span>
          )}
          {idx < parts.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  );
}

/** Shortens a link for display: the Drive file id where there is one. */
export function shortenLink(url: string): string {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("id") || u.pathname.split("/").pop() || url;
    return id.length > 18 ? id.slice(0, 18) + "…" : id;
  } catch {
    return url.length > 32 ? url.slice(0, 32) + "…" : url;
  }
}

/** Copies a URL, surfacing failure as a toast rather than a silent no-op. */
export async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  } catch {
    toast.error("Failed to copy");
  }
}
