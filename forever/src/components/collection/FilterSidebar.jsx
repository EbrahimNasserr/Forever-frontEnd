import { useState } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";

/* ── Size options pulled from common clothing sizes ── */
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

/* ── Price tier presets ── */
const buildPriceTiers = (min, max) => [
  { label: "All Prices", min, max },
  { label: `Under $${Math.round(max * 0.3)}`, min, max: Math.round(max * 0.3) },
  {
    label: `$${Math.round(max * 0.3)} – $${Math.round(max * 0.6)}`,
    min: Math.round(max * 0.3),
    max: Math.round(max * 0.6),
  },
  {
    label: `$${Math.round(max * 0.6)} – $${Math.round(max * 0.85)}`,
    min: Math.round(max * 0.6),
    max: Math.round(max * 0.85),
  },
  { label: `$${Math.round(max * 0.85)}+`, min: Math.round(max * 0.85), max },
];

/* ── Accordion section wrapper ── */
const Section = ({ id, label, collapsed, onToggle, children }) => (
  <div>
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between py-1 select-none cursor-pointer"
    >
      <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#1a1a1a]">
        {label}
      </h3>
      <ChevronDown
        className={`w-4 h-4 text-black/40 transition-transform duration-200 ${
          collapsed ? "-rotate-90" : ""
        }`}
      />
    </button>
    {!collapsed && <div className="mt-3">{children}</div>}
  </div>
);

/* ── Toggle pill button ── */
const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
      active
        ? "bg-[#1a1a1a] text-white font-medium border-[#1a1a1a]"
        : "bg-[#EBE8E3] text-black/70 hover:bg-white hover:text-[#1a1a1a] border-black/5"
    }`}
  >
    {children}
  </button>
);

/**
 * FilterSidebar
 *
 * Used both for the desktop sticky panel and as the scrollable body
 * inside the mobile drawer (pass isMobile=true for padding adjustments).
 */
const FilterSidebar = ({
  categoryOptions = [],
  categoriesLoading,
  categoriesError,
  selectedCategory,
  onSelectCategory,
  filters,
  onFiltersChange,
  onResetFilters,
  hasActiveFilters,
  priceMin = 0,
  priceMax = 5000,
  isMobile = false,
}) => {
  const priceTiers = buildPriceTiers(priceMin, priceMax);

  /* ── Accordion collapse state ── */
  const [collapsed, setCollapsed] = useState({
    categories: false,
    sizes: false,
    price: false,
    curations: false,
  });

  const toggleSection = (id) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const update = (patch) => onFiltersChange((f) => ({ ...f, ...patch }));

  const wrapperClass = isMobile
    ? "p-6 space-y-8"
    : "w-[280px] pr-6 space-y-8 border-r border-black/10 sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pb-12";

  return (
    <div className={wrapperClass}>

      {/* ── Categories ── */}
      <Section
        id="categories"
        label="Category"
        collapsed={collapsed.categories}
        onToggle={toggleSection}
      >
        {categoriesLoading && (
          <p className="text-xs text-black/50">Loading…</p>
        )}
        {!categoriesLoading && categoriesError && (
          <p className="text-xs text-red-500">Failed to load categories.</p>
        )}
        {!categoriesLoading && !categoriesError && (
          <div className="space-y-1">
            {/* All */}
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                selectedCategory === "all"
                  ? "bg-[#1a1a1a] text-white font-medium"
                  : "hover:bg-[#EBE8E3] text-black/70 hover:text-[#1a1a1a]"
              }`}
            >
              <span>All Collections</span>
            </button>

            {categoryOptions.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => onSelectCategory(cat.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#1a1a1a] text-white font-medium"
                      : "hover:bg-[#EBE8E3] text-black/70 hover:text-[#1a1a1a]"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {!categoriesLoading && categoryOptions.length === 0 && (
              <p className="text-xs text-black/40 px-3">No categories found.</p>
            )}
          </div>
        )}
      </Section>

      {/* ── Sizes ── */}
      <div className="pt-6 border-t border-black/10">
        <Section
          id="sizes"
          label="Size"
          collapsed={collapsed.sizes}
          onToggle={toggleSection}
        >
          <div className="flex flex-wrap gap-1.5">
            <Pill
              active={filters.selectedSize === null}
              onClick={() => update({ selectedSize: null })}
            >
              All
            </Pill>
            {SIZE_OPTIONS.map((sz) => (
              <Pill
                key={sz}
                active={filters.selectedSize === sz}
                onClick={() =>
                  update({ selectedSize: filters.selectedSize === sz ? null : sz })
                }
              >
                {sz}
              </Pill>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Price Range ── */}
      <div className="pt-6 border-t border-black/10">
        <Section
          id="price"
          label="Price Range"
          collapsed={collapsed.price}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-black/50">Up to:</span>
              <span className="font-serif text-base font-medium text-[#1a1a1a]">
                ${filters.priceRange[1].toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={Math.round((priceMax - priceMin) / 100)}
              value={filters.priceRange[1]}
              onChange={(e) =>
                update({ priceRange: [filters.priceRange[0], Number(e.target.value)] })
              }
              className="w-full accent-[#1a1a1a] cursor-pointer"
            />

            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {priceTiers.map((tier) => {
                const isActive =
                  filters.priceRange[0] === tier.min &&
                  filters.priceRange[1] === tier.max;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() =>
                      update({ priceRange: [tier.min, tier.max] })
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] text-center transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-medium"
                        : "bg-[#EBE8E3] text-black/70 hover:bg-white border-black/5"
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>
      </div>

      {/* ── Curations & Availability ── */}
      <div className="pt-6 border-t border-black/10">
        <Section
          id="curations"
          label="Curations & Status"
          collapsed={collapsed.curations}
          onToggle={toggleSection}
        >
          <div className="space-y-3 text-xs">
            <CheckRow
              id="filter-instock"
              label="In Stock — Ready to Ship"
              checked={filters.inStockOnly}
              onChange={(v) => update({ inStockOnly: v })}
            />
            <CheckRow
              id="filter-sale"
              label="On Sale / Reduced"
              checked={!!filters.onSaleOnly}
              onChange={(v) => update({ onSaleOnly: v })}
            />
            <CheckRow
              id="filter-new"
              label="New Arrivals Only"
              checked={filters.badgeFilter === "new"}
              onChange={(v) => update({ badgeFilter: v ? "new" : null })}
            />
            <CheckRow
              id="filter-bestseller"
              label="Best Sellers Only"
              checked={filters.badgeFilter === "bestseller"}
              onChange={(v) => update({ badgeFilter: v ? "bestseller" : null })}
            />
          </div>
        </Section>
      </div>

      {/* ── Reset button ── */}
      {hasActiveFilters && (
        <div className="pt-4">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2.5 rounded-xl bg-[#EBE8E3] hover:bg-black/10 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] flex items-center justify-center gap-2 transition-colors cursor-pointer border border-black/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Accessible checkbox row ── */
const CheckRow = ({ id, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2.5 cursor-pointer text-black/80 hover:text-[#1a1a1a]"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded accent-[#1a1a1a] cursor-pointer w-4 h-4"
    />
    <span>{label}</span>
  </label>
);

export default FilterSidebar;
