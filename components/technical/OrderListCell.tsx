"use client";

import { useMemo, useState } from "react";
import { Files, FileText, ExternalLink, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { copyLink, parseLinks, shortenLink } from "./linksCell";

/**
 * Renders the `ORDER LIST` cell as a "View File(s)" button that opens the linked
 * purchase orders in a dialog.
 *
 * The cell holds a comma-separated list of Drive links, so it cannot be a plain
 * anchor — one cell can be several files, and the raw URLs are too long to sit
 * in a table row.
 */
export default function OrderListCell({
  display,
  poNo,
}: {
  display: string;
  poNo?: string;
}) {
  const links = useMemo(() => parseLinks(display), [display]);
  const [open, setOpen] = useState(false);

  if (links.length === 0) {
    return (
      <span className="truncate block text-ink-muted" title={display}>
        —
      </span>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        className="h-6 text-[11px] gap-1.5 px-2 font-semibold"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={links.join(", ")}
      >
        <Files size={12} className="shrink-0" />
        {links.length === 1 ? "View File" : `View Files (${links.length})`}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-line bg-surface-soft">
            <DialogTitle className="text-sm font-bold text-ink flex items-center gap-2">
              <FileText size={16} className="text-primary/70" />
              {poNo ? `Attachments — ${poNo}` : `Attachments`}
              <span className="ml-1 text-xs font-semibold text-ink/60">
                ({links.length})
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {links.length === 1
                ? "1 file linked to this PO"
                : `${links.length} files linked to this PO`}{" "}
              from GMD Clientwise
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-line">
            {links.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft transition-colors"
              >
                <div className="shrink-0 w-8 h-8 rounded bg-surface border border-line flex items-center justify-center text-ink/70">
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-ink">
                    File {idx + 1}
                  </div>
                  <div
                    className="text-[11px] text-muted-foreground truncate"
                    title={url}
                  >
                    {shortenLink(url)}
                  </div>
                  <div
                    className="text-[10px] text-ink/50 truncate"
                    title={url}
                  >
                    {url}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-7 px-2 gap-1 text-[11px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(url);
                    }}
                    title="Copy link"
                  >
                    <Copy size={12} /> Copy
                  </Button>
                  <Button
                    variant="default"
                    size="xs"
                    className="h-7 px-2.5 gap-1 text-[11px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    title="Open file"
                  >
                    <ExternalLink size={12} /> Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
