import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useGetAllProductsQuery } from "../../features/products/productsApi";

import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";

import { useCollectionFilters } from "../../features/collection/hooks/useCollectionFilters";
import { SORT_OPTIONS } from "./sortOptions";

import FilterSidebar from "./FilterSidebar";
import CollectionHeader from "./CollectionHeader";
import ProductGrid from "./ProductGrid";

const Collection = () => {
  const { search } = useLocation();
  const category = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("category");
  }, [search]);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAllProductsQuery(category);

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    return categoriesResponse?.categories ?? [];
  }, [categoriesResponse]);

  const {
    selectedCategories,
    selectedTypes,
    sortBy,
    toggleCategory,
    toggleType,
    setSortBy,
    clearFilters,
    categoryOptions,
    typeOptions,
    displayedProducts,
  } = useCollectionFilters(products, categories);

  const isSidebarLoading = categoriesLoading;

  const productsCount = displayedProducts?.length ?? 0;

  return (
    <section className="my-12 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
      <div>
        <aside className="rounded-lg border border-gray-200 p-5">
          {isSidebarLoading && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-gray-900">
                Filters
              </h3>
              <p className="mt-4 text-sm text-gray-500">Loading filters…</p>
            </div>
          )}

          {!isSidebarLoading && categoriesError && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-gray-900">
                Filters
              </h3>
              <p className="mt-4 text-sm text-red-600">
                Failed to load filters.
              </p>
            </div>
          )}

          {!isSidebarLoading && !categoriesError && (
            <FilterSidebar
              categoryOptions={categoryOptions}
              typeOptions={typeOptions}
              selectedCategories={selectedCategories}
              selectedTypes={selectedTypes}
              onToggleCategory={toggleCategory}
              onToggleType={toggleType}
              onClearFilters={clearFilters}
            />
          )}
        </aside>
      </div>

      <div>
        <CollectionHeader
          count={productsCount}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOptions={SORT_OPTIONS}
        />

        {productsLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[260px] rounded-lg border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        )}

        {!productsLoading && productsError && (
          <p className="text-sm text-red-600">Failed to load products.</p>
        )}

        {!productsLoading && !productsError && (
          <ProductGrid products={displayedProducts} />
        )}

        {!productsLoading && !productsError && productsCount === 0 && (
          <p className="mt-6 text-sm text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Collection;
