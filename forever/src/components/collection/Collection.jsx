import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RotateCcw,
  X,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  Tag,
} from "lucide-react";

import { useGetAllProductsQuery } from "../../features/products/productsApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { SORT_OPTIONS } from "./sortOptions";

import FilterSidebar from "./FilterSidebar";
import CollectionHeader from "./CollectionHeader";
import ProductGrid from "./ProductGrid";

// Price range constants — adjust to match your catalogue
const PRICE_MIN = 0;
const PRICE_MAX = 5000;

const DEFAULT_FILTERS = {
  searchQuery: "",
  sortBy: "relevant",
  selectedSize: null,
  priceRange: [PRICE_MIN, PRICE_MAX],
  inStockOnly: false,
  onSaleOnly: false,
  badgeFilter: null, // null | "new" | "bestseller"
};

const Collection = ({ wishlistIds = [], onToggleWishlist, onQuickView }) => {
  /* ─── URL-driven category ─── */
  const { search } = useLocation();
  const navigate = useNavigate();

  const categoryFromUrl = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("category") ?? "all";
  }, [search]);

  const setCategory = useCallback(
    (slug) => {
      const params = new URLSearchParams(search);
      if (!slug || slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      navigate({ search: params.toString() }, { replace: true });
    },
    [search, navigate]
  );

  /* ─── Remote data ─── */
  // Pass category to API only when it's not "all"
  const apiCategory = categoryFromUrl === "all" ? undefined : categoryFromUrl;

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAllProductsQuery(apiCategory);

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const categories = useMemo(
    () => categoriesResponse?.categories ?? [],
    [categoriesResponse]
  );

  /* ─── Client filter state ─── */
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Keep category in sync if the URL changes externally (e.g. navbar link)
  useEffect(() => {
    // no-op — category is read directly from URL, not stored in filters state
  }, [categoryFromUrl]);

  /* ─── UI state ─── */
  const [isSidebarOpenDesktop, setIsSidebarOpenDesktop] = useState(true);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  /* ─── Derived category options ─── */
  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories
      .filter((c) => c?.isActive)
      .map((c) => ({
        label:
          typeof c?.name === "string" && c.name
            ? c.name.charAt(0).toUpperCase() + c.name.slice(1)
            : "",
        value: c?.slug ?? "",
      }))
      .filter((o) => Boolean(o.value));
  }, [categories]);

  /* ─── Filtered + sorted products ─── */
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter((p) => {
        const name = (p.name ?? "").toLowerCase();
        const desc = (p.description ?? "").toLowerCase();
        const cat = (p.category ?? "").toLowerCase();
        const sub = (p.subCategory ?? "").toLowerCase();
        return (
          name.includes(q) ||
          desc.includes(q) ||
          cat.includes(q) ||
          sub.includes(q)
        );
      });
    }

    // Price range
    list = list.filter(
      (p) =>
        Number(p.price) >= filters.priceRange[0] &&
        Number(p.price) <= filters.priceRange[1]
    );

    // In-stock
    if (filters.inStockOnly) {
      list = list.filter((p) => Number(p.stockCount ?? 1) > 0);
    }

    // On-sale
    if (filters.onSaleOnly) {
      list = list.filter(
        (p) => p.originalPrice && Number(p.originalPrice) > Number(p.price)
      );
    }

    // Size
    if (filters.selectedSize) {
      const target = filters.selectedSize.toLowerCase();
      list = list.filter((p) =>
        (p.sizes ?? []).some((s) => s.toLowerCase() === target)
      );
    }

    // Badge
    if (filters.badgeFilter === "bestseller") {
      list = list.filter((p) => p.bestseller);
    }
    if (filters.badgeFilter === "new") {
      // "new" = products added within the last 30 days
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((p) => Number(p.date) >= cutoff);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "bestseller":
        list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      case "newest":
        list.sort((a, b) => Number(b.date) - Number(a.date));
        break;
      default:
        break; // "relevant" — keep API order
    }

    return list;
  }, [products, filters]);

  /* ─── Active filter helpers ─── */
  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.selectedSize !== null ||
    filters.badgeFilter !== null ||
    filters.onSaleOnly ||
    filters.inStockOnly ||
    filters.priceRange[0] > PRICE_MIN ||
    filters.priceRange[1] < PRICE_MAX;

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.searchQuery.trim()) n++;
    if (filters.selectedSize) n++;
    if (filters.badgeFilter) n++;
    if (filters.onSaleOnly) n++;
    if (filters.inStockOnly) n++;
    if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) n++;
    // category counts too for the mobile badge
    if (categoryFromUrl !== "all") n++;
    return n;
  }, [filters, categoryFromUrl]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCategory("all");
  }, [setCategory]);

  /* ─── Current category label ─── */
  const activeCategoryLabel = useMemo(() => {
    if (categoryFromUrl === "all") return "All Collections";
    const match = categoryOptions.find((c) => c.value === categoryFromUrl);
    return match?.label ?? categoryFromUrl;
  }, [categoryFromUrl, categoryOptions]);

  /* ─── Loading skeletons ─── */
  const isLoading = productsLoading;

  return (
    <div className="pt-12 pb-24 px-4 sm:px-8 lg:px-12 bg-[#F5F2ED] text-[#1a1a1a] min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Hero Header ── */}
        <CollectionHeader
          categoryLabel={activeCategoryLabel}
          categoryFromUrl={categoryFromUrl}
          filteredCount={displayedProducts.length}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {/* ── Control Toolbar ── */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EBE8E3] border border-black/10 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">

          {/* Left: filter buttons + search */}
          <div className="flex items-center gap-2.5">

            {/* Mobile filter trigger */}
            <button
              onClick={() => setIsMobileFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#1a1a1a] text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpenDesktop((v) => !v)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-[#F5F2ED] hover:bg-white text-xs font-medium text-[#1a1a1a] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-black/60" />
              <span>
                {isSidebarOpenDesktop ? "Hide Filters" : "Show Filters"}
              </span>
              {activeFilterCount > 0 && !isSidebarOpenDesktop && (
                <span className="px-1.5 rounded-full bg-[#1a1a1a] text-white text-[9px] font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative w-44 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products…"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, searchQuery: e.target.value }))
                }
                className="w-full pl-8 pr-7 py-2 text-xs bg-[#F5F2ED] border border-black/10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] placeholder:text-black/40 text-[#1a1a1a]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, searchQuery: "" }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#1a1a1a]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right: grid switcher + sort */}
          <div className="flex items-center gap-3">

            {/* Grid switcher — desktop only */}
            <div className="hidden md:flex items-center bg-[#F5F2ED] p-1 rounded-full border border-black/10">
              {[
                { cols: 2, Icon: Grid2X2, title: "2 Columns" },
                { cols: 3, Icon: Grid3X3, title: "3 Columns" },
                { cols: 4, Icon: LayoutGrid, title: "4 Columns" },
              ].map(({ cols, Icon, title }) => (
                <button
                  key={cols}
                  onClick={() => setGridColumns(cols)}
                  title={title}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    gridColumns === cols
                      ? "bg-[#1a1a1a] text-white"
                      : "text-black/50 hover:text-[#1a1a1a]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-black/40 pointer-events-none" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, sortBy: e.target.value }))
                }
                className="pl-8 pr-8 py-2 text-xs bg-[#F5F2ED] border border-black/10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] font-medium text-[#1a1a1a] cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Active Filter Chips ── */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-xl bg-black/[0.02] border border-black/5"
            >
              <span className="text-[11px] font-semibold tracking-wider uppercase text-black/50 mr-1">
                Active:
              </span>

              {categoryFromUrl !== "all" && (
                <Chip
                  label={`Category: ${activeCategoryLabel}`}
                  onRemove={() => setCategory("all")}
                />
              )}
              {filters.searchQuery.trim() && (
                <Chip
                  label={`"${filters.searchQuery}"`}
                  onRemove={() => setFilters((f) => ({ ...f, searchQuery: "" }))}
                />
              )}
              {filters.selectedSize && (
                <Chip
                  label={`Size: ${filters.selectedSize}`}
                  onRemove={() => setFilters((f) => ({ ...f, selectedSize: null }))}
                />
              )}
              {(filters.priceRange[0] > PRICE_MIN ||
                filters.priceRange[1] < PRICE_MAX) && (
                <Chip
                  label={`$${filters.priceRange[0]} – $${filters.priceRange[1]}`}
                  onRemove={() =>
                    setFilters((f) => ({
                      ...f,
                      priceRange: [PRICE_MIN, PRICE_MAX],
                    }))
                  }
                />
              )}
              {filters.inStockOnly && (
                <Chip
                  label="In Stock"
                  onRemove={() => setFilters((f) => ({ ...f, inStockOnly: false }))}
                />
              )}
              {filters.onSaleOnly && (
                <Chip
                  label="On Sale"
                  onRemove={() => setFilters((f) => ({ ...f, onSaleOnly: false }))}
                />
              )}
              {filters.badgeFilter && (
                <Chip
                  label={
                    filters.badgeFilter === "new" ? "New Arrivals" : "Best Sellers"
                  }
                  onRemove={() => setFilters((f) => ({ ...f, badgeFilter: null }))}
                />
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-black/60 hover:text-[#1a1a1a] underline font-semibold ml-2 cursor-pointer"
              >
                Clear All ({activeFilterCount})
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* Desktop sidebar */}
          <AnimatePresence initial={false}>
            {isSidebarOpenDesktop && (
              <motion.aside
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <FilterSidebar
                  categoryOptions={categoryOptions}
                  categoriesLoading={categoriesLoading}
                  categoriesError={categoriesError}
                  selectedCategory={categoryFromUrl}
                  onSelectCategory={setCategory}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onResetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  priceMin={PRICE_MIN}
                  priceMax={PRICE_MAX}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1 w-full min-w-0">
            <ProductGrid
              products={displayedProducts}
              isLoading={isLoading}
              isError={productsError}
              gridColumns={gridColumns}
              wishlistIds={wishlistIds}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onResetFilters={resetFilters}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {isMobileFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-screen max-w-md bg-[#F5F2ED] text-[#1a1a1a] shadow-2xl flex flex-col"
              >
                {/* Drawer header */}
                <div className="p-6 border-b border-black/10 flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] font-bold text-black/50 uppercase block">
                      Filters
                    </span>
                    <h3 className="font-serif text-2xl font-light uppercase">
                      Refine Collection
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsMobileFilterDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-[#EBE8E3] text-[#1a1a1a] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable filter body — reuses the same sidebar component */}
                <div className="flex-1 overflow-y-auto">
                  <FilterSidebar
                    categoryOptions={categoryOptions}
                    categoriesLoading={categoriesLoading}
                    categoriesError={categoriesError}
                    selectedCategory={categoryFromUrl}
                    onSelectCategory={(slug) => {
                      setCategory(slug);
                      setIsMobileFilterDrawerOpen(false);
                    }}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onResetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                    priceMin={PRICE_MIN}
                    priceMax={PRICE_MAX}
                    isMobile
                  />
                </div>

                {/* Drawer footer */}
                <div className="p-6 border-t border-black/10 shrink-0 flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="py-3 px-4 rounded-full border border-black/10 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] hover:bg-[#EBE8E3] transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterDrawerOpen(false)}
                    className="flex-1 py-3 px-6 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black/80 transition-colors cursor-pointer text-center"
                  >
                    Show {displayedProducts.length} Results
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Small reusable chip ── */
const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a] text-white text-[11px] font-medium">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:opacity-75 cursor-pointer">
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default Collection;
