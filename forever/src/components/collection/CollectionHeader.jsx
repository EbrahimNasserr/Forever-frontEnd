const CollectionHeader = ({ count, sortBy, onSortByChange, sortOptions }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            onChange={(e) => onSortByChange(e.target.value)}
            className="min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500 sm:text-left">
        Showing <span className="font-semibold text-gray-900">{count}</span>{" "}
        items
      </p>
    </div>
  );
};

export default CollectionHeader;
