import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ratingLevels = [5, 4, 3, 2, 1];

const ReviewSummary = ({ ratingValue, ratingCount, distribution }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const totalReviews =
    ratingCount || Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-8 lg:gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-center lg:gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Customer reviews
            </p>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-5xl font-bold text-gray-900">
                  {ratingValue != null ? ratingValue.toFixed(1) : "0.0"}
                </p>
                <div className="mt-2 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const filled =
                      ratingValue != null && ratingValue >= index + 1;
                    return (
                      <Star
                        key={index}
                        className={
                          filled
                            ? "size-5 text-amber-500"
                            : "size-5 text-gray-300"
                        }
                        fill={filled ? "currentColor" : "none"}
                        aria-hidden
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {totalReviews}
                </p>
                <p className="text-xs text-gray-600">reviews</p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 lg:w-auto lg:min-w-90">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              Rating breakdown
            </p>
            {ratingLevels.map((rating) => {
              const count = distribution[rating] ?? 0;
              const percentage =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              const isHovered =
                hoveredRating === rating || hoveredRating === null;

              return (
                <motion.div
                  key={rating}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="group cursor-pointer transition"
                  layout
                >
                  <div className="flex items-center gap-3">
                    <div className="flex w-14 items-center gap-1 sm:w-16">
                      <span className="text-sm font-semibold text-gray-700">
                        {rating}
                      </span>
                      <Star
                        className="size-3.5 text-amber-500"
                        fill="currentColor"
                        aria-hidden
                      />
                    </div>

                    <div className="relative flex-1 overflow-hidden rounded-full bg-linear-to-r from-gray-100 to-gray-50 h-3 sm:h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full rounded-full bg-linear-to-r transition-all ${
                          isHovered
                            ? "from-amber-400 via-amber-500 to-amber-600 shadow-md shadow-amber-500/30"
                            : "from-amber-500 to-amber-400"
                        }`}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex w-16 flex-col items-end gap-0.5 sm:w-20">
                      <span className="text-sm font-semibold text-gray-900">
                        {percentage}%
                      </span>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ReviewSummary);
