const OrderSkeleton = () => (
  <div className="space-y-6">
    {[1, 2].map((n) => (
      <div
        key={n}
        className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm animate-pulse"
      >
        {/* Top bar */}
        <div className="bg-[#FAF8F5] px-8 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="flex gap-6">
            <div className="h-4 w-32 bg-black/10 rounded-full" />
            <div className="h-4 w-28 bg-black/10 rounded-full" />
            <div className="h-4 w-20 bg-black/10 rounded-full" />
          </div>
          <div className="h-8 w-28 bg-black/10 rounded-full" />
        </div>

        {/* Items */}
        <div className="p-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-20 h-24 bg-black/10 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-black/10 rounded-full" />
                <div className="h-3 w-56 bg-black/10 rounded-full" />
                <div className="h-3 w-32 bg-black/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default OrderSkeleton;
