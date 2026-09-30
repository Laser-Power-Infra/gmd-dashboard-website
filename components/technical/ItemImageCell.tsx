"use client";

import { useState } from "react";
import { ImageIcon, ExternalLink, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ItemImage } from "@/lib/gmd/types";
import { copyLink } from "./linksCell";

/**
 * Renders the item-code cell with an adjacent image-gallery button.
 *
 * With no images the cell degrades to plain text, so a tab that has no Drive
 * data wired up yet looks like an ordinary column rather than a broken widget.
 */
export default function ItemImageCell({
  images,
  code,
}: {
  images: ItemImage[];
  code: string;
}) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <span className="truncate block" title={code}>
        {code || "—"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="truncate" title={code}>
        {code}
      </span>
      <Button
        variant="outline"
        size="xs"
        className="h-6 shrink-0 px-1.5 font-semibold"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`View ${images.length} image${images.length === 1 ? "" : "s"} for ${code}`}
        title={`${images.length} image${images.length === 1 ? "" : "s"}\n${images
          .map(
            (i) =>
              `${i.itemType ?? ""} / ${i.operationType ?? ""} / ${i.rmType ?? ""}`,
          )
          .join("\n")}`}
      >
        <ImageIcon size={12} className="shrink-0" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-line bg-surface-soft">
            <DialogTitle className="text-sm font-bold text-ink flex items-center gap-2">
              <ImageIcon size={16} className="text-primary/70" />
              Images — {code}
              <span className="ml-1 text-xs font-semibold text-ink/60">
                ({images.length})
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Item images linked to this item code
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-line">
            {images.map((image, idx) => {
              const href =
                image.url ??
                (image.driveFileId
                  ? `https://drive.google.com/file/d/${image.driveFileId}/view`
                  : null);
              const combo = [image.itemType, image.operationType, image.rmType]
                .map((p) => (p ?? "").trim())
                .filter(Boolean)
                .join(" / ");
              return (
                <div
                  key={`${image.imageKey}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded border border-line bg-surface overflow-hidden flex items-center justify-center">
                    {image.driveFileId ? (
                      <img
                        src={`https://drive.google.com/thumbnail?id=${image.driveFileId}&sz=w400`}
                        alt={combo || "item image"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon size={14} className="text-ink/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-semibold text-ink truncate"
                      title={combo}
                    >
                      {combo || "Unlabelled image"}
                    </div>
                    <div
                      className="text-[10px] text-ink/50 truncate"
                      title={image.imageKey}
                    >
                      {image.imageKey}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {href ? (
                      <>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 px-2 gap-1 text-[11px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLink(href);
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
                            window.open(href, "_blank", "noopener,noreferrer");
                          }}
                          title="Open in Drive"
                        >
                          <ExternalLink size={12} /> Open
                        </Button>
                      </>
                    ) : (
                      <span className="text-[11px] italic text-muted-foreground">
                        No link
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
