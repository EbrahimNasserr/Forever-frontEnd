import { Star } from "lucide-react";

const Reviews = ({ ratingValue, ratingCount }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Customer reviews</p>
          <p className="mt-1 text-sm text-gray-600">
            {ratingValue != null ? ratingValue.toFixed(1) : "No rating yet"}
            {ratingCount != null ? ` · ${ratingCount} reviews` : ""}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = ratingValue != null && ratingValue >= i + 1;
            return (
              <Star
                key={i}
                className={[
                  "size-4",
                  filled ? "text-amber-500" : "text-gray-300",
                ].join(" ")}
                fill={filled ? "currentColor" : "none"}
                aria-hidden
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
        Reviews UI is ready. Connect your backend reviews list here (user name,
        date, comment, rating, etc.).
      </div>
    </div>
  );
};

export default Reviews;
