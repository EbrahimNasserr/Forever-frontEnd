const FilterSidebar = ({
  categoryOptions,
  typeOptions,
  selectedCategories,
  selectedTypes,
  onToggleCategory,
  onToggleType,
  onClearFilters,
}) => {
  return (
    <aside className="rounded-lg border border-gray-200 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-900">
          Filters
        </h3>
        <button
          type="button"
          onClick={onClearFilters}
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
            {categoryOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(opt.value)}
                  onChange={() => onToggleCategory(opt.value)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}

            {categoryOptions.length === 0 && (
              <p className="text-sm text-gray-400">No categories</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Type
          </p>
          <div className="mt-3 space-y-2">
            {typeOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.has(opt.value)}
                  onChange={() => onToggleType(opt.value)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}

            {typeOptions.length === 0 && (
              <p className="text-sm text-gray-400">No types</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
