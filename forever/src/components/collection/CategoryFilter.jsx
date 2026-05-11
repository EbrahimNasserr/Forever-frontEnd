const CategoryFilter = ({ options, selectedSet, onToggle }) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Category
      </p>
      <div className="mt-3 space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selectedSet.has(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
