import { useState } from "react";
import ProductItem from "../share/ProductItem.jsx";
import { useGetAllProductsQuery } from "../../features/products/productsApi";

const CATEGORY_OPTIONS = ["Men", "Women", "Kids"];
const TYPE_OPTIONS = ["Topwear", "Bottomwear", "Winterwear"];

const SORT_OPTIONS = [
  { value: "relevant", label: "Relevant" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const Collection = () => {
  const { data: products = [] } = useGetAllProductsQuery();
  const [categories, setCategories] = useState(new Set());
  const [types, setTypes] = useState(new Set());
  const [sortBy, setSortBy] = useState("relevant");

  const toggleInSet = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const toggleCategory = toggleInSet(setCategories);
  const toggleType = toggleInSet(setTypes);

  const filtered = Array.isArray(products)
    ? products.filter((p) => {
        const matchCategory =
          categories.size === 0 ? true : categories.has(p?.category);
        const matchType = types.size === 0 ? true : types.has(p?.subCategory);
        return matchCategory && matchType;
      })
    : [];

  const displayed =
    sortBy === "relevant"
      ? filtered
      : [...filtered].sort((a, b) => {
          const pa = a?.price ?? 0;
          const pb = b?.price ?? 0;
          return sortBy === "price-asc" ? pa - pb : pb - pa;
        });

  const clearFilters = () => {
    setCategories(new Set());
    setTypes(new Set());
  };

  return (
    <section className="my-12 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
      <aside className="rounded-lg border border-gray-200 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold tracking-wide text-gray-900">
            Filters
          </h3>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Category
            </p>
            <div className="mt-3 space-y-2">
              {CATEGORY_OPTIONS.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={categories.has(c)}
                    onChange={() => toggleCategory(c)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Type
            </p>
            <div className="mt-3 space-y-2">
              {TYPE_OPTIONS.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={types.has(t)}
                    onChange={() => toggleType(t)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-6">
          <div className="flex flex-col  gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-3 items-center">
              <h2 className="prata-regular uppercase text-2xl font-medium leading-relaxed md:text-3xl">
                all collections
              </h2>
              <span className="w-8 sm:w-24 md-w-10 h-[1.5px] bg-[#414141]"></span>
            </div>
            <label className="flex shrink-0 flex-col gap-1 text-left sm:items-end">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500 sm:text-left">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {displayed.length}
            </span>{" "}
            items
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {displayed.map((p) => (
            <ProductItem key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
