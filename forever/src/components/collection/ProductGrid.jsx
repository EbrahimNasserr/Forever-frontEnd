import { RotateCcw, Tag } from "lucide-react";
import ProductItem from "../share/ProductItem.jsx";

/* ── Loading skeleton card ── */
const SkeletonCard = () => (
  <div className="rounded-[32px] bg-[#EBE8E3] overflow-hidden animate-pulse">
    <div className="aspect-[3/4] w-full bg-[#DDD9D3]" />
    <div className="p-5 space-y-3">
      <div className="h-3 rounded-full bg-[#DDD9D3] w-1/3" />
      <div className="h-5 rounded-full bg-[#DDD9D3] w-2/3" />
      <div className="h-3 rounded-full bg-[#DDD9D3] w-1/2" />
    </div>
  </div>
);

/**
 * ProductGrid
 *
 * Renders a responsive product grid with:
 * - loading skeletons
 * - error state
 * - empty state with reset CTA
 * - configurable column count (2 | 3 | 4)
 * - wishlist + quick-view + quick-add forwarded to each ProductItem
 */
const ProductGrid = ({
  products = [],
  isLoading = false,
  isError = false,
  gridColumns = 3,
  wishlistIds = [],
  onToggleWishlist,
  onQuickView,
  onResetFilters,
}) => {
  /* ── Grid class by column count ── */
  const gridClass =
    gridColumns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridColumns === 4
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // default 3

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-x-6 gap-y-12`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* ── Error state ── */
  if (isError) {
    return (
      <div className="py-24 px-6 text-center rounded-[28px] bg-[#EBE8E3] border border-black/10 max-w-2xl mx-auto">
        <p className="text-sm text-red-600 font-medium">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <div className="py-24 px-6 text-center rounded-[28px] bg-[#EBE8E3] border border-black/10 max-w-2xl mx-auto">
        <Tag className="w-8 h-8 text-black/40 mx-auto mb-4" />
        <h3 className="prata-regular text-3xl font-light text-[#1a1a1a] uppercase tracking-tight">
          No Products Match
        </h3>
        <p className="text-xs sm:text-sm text-black/60 mt-3 mb-8 max-w-md mx-auto leading-relaxed">
          No products match your current filters. Try adjusting or clearing
          your selections.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-black/80 transition-all cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  /* ── Products grid ── */
  return (
    <div className={`grid ${gridClass} gap-x-6 gap-y-12 transition-all`}>
      {products.map((product, index) => (
        <ProductItem
          key={product._id}
          product={product}
          index={index}
          wishlistIds={wishlistIds}
          onToggleWishlist={onToggleWishlist}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
