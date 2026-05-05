const ProductDetailsSkeleton = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="animate-pulse overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5">
          <div className="aspect-square w-full bg-gray-400" />
        </div>

        <div className="min-w-0">
          <div className="animate-pulse">
            <div className="h-3 w-40 rounded bg-gray-400" />
            <div className="mt-3 h-8 w-3/4 rounded bg-gray-400" />
            <div className="mt-4 h-6 w-28 rounded bg-gray-400" />

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-gray-400" />
              <div className="h-4 w-11/12 rounded bg-gray-400" />
              <div className="h-4 w-10/12 rounded bg-gray-400" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="h-11 w-28 rounded-xl bg-gray-400" />
              <div className="h-11 w-40 rounded-xl bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
