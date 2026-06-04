import { memo } from "react";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

const ratingOptions = [
  { value: null, label: "All Ratings" },
  { value: 5, label: "5 Stars" },
  { value: 4, label: "4 Stars" },
  { value: 3, label: "3 Stars" },
  { value: 2, label: "2 Stars" },
  { value: 1, label: "1 Star" },
];

const ReviewFilters = ({
  sort,
  onSortChange,
  ratingFilter,
  onRatingChange,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Filter reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Refine the reviews shown for this product
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Rating</p>
          <div className="mt-3 grid gap-2">
            {ratingOptions.map((option) => {
              const active = option.value === ratingFilter;
              return (
                <button
                  type="button"
                  key={String(option.value)}
                  onClick={() => onRatingChange(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ReviewFilters);
