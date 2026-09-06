import { Search, X } from "lucide-react";

const OrderFilters = ({
  tabs,
  selectedFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-8">
    {/* Status tabs */}
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
            selectedFilter === tab.id
              ? "bg-[#1a1a1a] text-white shadow-sm"
              : "bg-white hover:bg-[#EBE8E3] text-black/70 border border-black/10"
          }`}
        >
          <span>{tab.label}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedFilter === tab.id
                ? "bg-white/20 text-white"
                : "bg-black/10 text-black/70"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>

    {/* Search */}
    <div className="relative w-full sm:w-72 flex-shrink-0">
      <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search order ID or product…"
        className="w-full pl-10 pr-9 py-2 rounded-full bg-white border border-black/10 text-xs text-[#1a1a1a] placeholder-black/40 focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

export default OrderFilters;
