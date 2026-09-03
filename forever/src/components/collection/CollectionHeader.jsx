import { RotateCcw, Sparkles } from "lucide-react";

/**
 * CollectionHeader
 *
 * The editorial-style page hero sitting above the toolbar.
 */
const CollectionHeader = ({
  categoryLabel,
  categoryFromUrl,
  filteredCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <>
      {/* Breadcrumb row */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-black/50">
          <span className="text-[#1a1a1a] font-semibold">Shop</span>
          {categoryFromUrl !== "all" && (
            <>
              <span className="text-black/30">/</span>
              <span className="text-[#1a1a1a] font-semibold">{categoryLabel}</span>
            </>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE8E3] border border-black/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
          <Sparkles className="w-3 h-3 text-[#1a1a1a]" />
          Forever
        </span>
      </div>

      {/* Hero block */}
      <div className="mb-10 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-black/50 font-semibold block mb-2">
              THE COLLECTION
            </span>
            <h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] uppercase leading-tight">
              {categoryFromUrl === "all" ? "All Collections" : categoryLabel}
            </h1>
            <p className="text-xs sm:text-sm text-black/60 mt-3 max-w-2xl font-light leading-relaxed">
              Browse and refine the full range. Filter by category, size, price
              and availability to find exactly what you're looking for.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-black/60 font-mono">
              {filteredCount}{" "}
              {filteredCount === 1 ? "product" : "products"} available
            </span>
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1.5 text-xs text-[#1a1a1a] font-semibold hover:opacity-60 cursor-pointer underline underline-offset-4"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionHeader;
