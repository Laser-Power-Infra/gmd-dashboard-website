"use client";

const btnBase =
  "bg-white border border-line rounded text-ink px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-all hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed min-w-[32px] text-center";

export default function Pagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-surface-soft border-t border-line px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-ink font-medium">
          Showing {from}–{to} of {total.toLocaleString()}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          aria-label="Rows per page"
          className="bg-white border border-line rounded px-2 py-1 text-xs text-ink font-semibold outline-none cursor-pointer focus:border-primary"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={1000}>1000</option>
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={btnBase}
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          FIRST
        </button>
        <button
          type="button"
          className={btnBase}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          PREV
        </button>
        {pageNumbers.map((page, i) =>
          page === "..." ? (
            <span key={`e${i}`} className="px-1 text-ink/40 font-semibold">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              className={`${btnBase} ${
                page === currentPage
                  ? "bg-primary! border-primary! text-white!"
                  : ""
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          className={btnBase}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          NEXT
        </button>
        <button
          type="button"
          className={btnBase}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          LAST
        </button>
      </div>
    </div>
  );
}
