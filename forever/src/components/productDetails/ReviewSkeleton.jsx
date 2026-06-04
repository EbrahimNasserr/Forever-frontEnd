import { motion } from "framer-motion";

export const ReviewSummarySkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5"
  >
    <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
      <div className="space-y-4">
        <div className="h-8 w-36 rounded-full bg-gray-200" />
        <div className="h-12 w-28 rounded-full bg-gray-200" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 rounded-full bg-gray-200" />
            <div className="h-2 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const ReviewCardSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 rounded-full bg-gray-200" />
        <div className="h-3 w-32 rounded-full bg-gray-200" />
      </div>
    </div>
    <div className="mt-5 space-y-3">
      <div className="h-4 w-32 rounded-full bg-gray-200" />
      <div className="h-3 w-full rounded-full bg-gray-200" />
      <div className="h-3 w-full rounded-full bg-gray-200" />
      <div className="mt-4 flex gap-3">
        <div className="h-10 w-24 rounded-2xl bg-gray-200" />
        <div className="h-10 w-24 rounded-2xl bg-gray-200" />
      </div>
    </div>
  </div>
);
