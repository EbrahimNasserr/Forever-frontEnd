import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ErrorState from "../share/ErrorState.jsx";
import ReviewSummary from "./ReviewSummary.jsx";
import ReviewFilters from "./ReviewFilters.jsx";
import ReviewCard from "./ReviewCard.jsx";
import ReviewPagination from "./ReviewPagination.jsx";
import WriteReviewForm from "./WriteReviewForm.jsx";
import {
  ReviewCardSkeleton,
  ReviewSummarySkeleton,
} from "./ReviewSkeleton.jsx";
import { useReviewFilters } from "../../features/reviews/useReviews";
import {
  useMarkHelpfulMutation,
  useReportReviewMutation,
} from "../../features/reviews/reviewsApi";

const Reviews = ({ productId, ratingValue, ratingCount }) => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    setPage,
    sort,
    setSort,
    rating,
    setRating,
  } = useReviewFilters(productId);

  const [markHelpful] = useMarkHelpfulMutation();
  const [reportReview] = useReportReviewMutation();
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth?.isAuthenticated),
  );

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };
  const isLoadingState = isLoading || isFetching;

  const reviewDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (data?.reviews ?? []).forEach((review) => {
      const ratingValue = Number(review.rating);
      if (ratingValue >= 1 && ratingValue <= 5) {
        counts[ratingValue] += 1;
      }
    });
    return counts;
  }, [data?.reviews]);

  const handleMarkHelpful = async ({ reviewId }) => {
    try {
      await markHelpful({ reviewId, productId }).unwrap();
      toast.success("Marked as helpful");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to mark helpful",
      );
      throw error;
    }
  };

  const handleReportReview = async ({ reviewId }) => {
    try {
      await reportReview({ reviewId, productId }).unwrap();
      toast.success("Review reported");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to report review",
      );
      throw error;
    }
  };

  const handleReviewSubmitted = () => {
    refetch();
  };

  if (!productId) return null;

  if (isError) {
    return (
      <ErrorState
        title="Failed to load reviews"
        message="Something went wrong while fetching product reviews."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {isLoadingState ? (
        <ReviewSummarySkeleton />
      ) : (
        <ReviewSummary
          ratingValue={ratingValue}
          ratingCount={ratingCount ?? pagination.total}
          distribution={reviewDistribution}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ReviewFilters
          sort={sort}
          onSortChange={setSort}
          ratingFilter={rating}
          onRatingChange={setRating}
        />

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Reviews</p>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {reviews.length} of {ratingCount ?? pagination.total}{" "}
                  reviews
                </p>
              </div>
              {isLoadingState ? (
                <div className="h-8 w-20 rounded-full bg-gray-200" />
              ) : null}
            </div>
          </div>

          {isLoadingState ? (
            <div className="space-y-4">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          ) : reviews.length ? (
            <div className="space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <ReviewCard
                      review={review}
                      onMarkHelpful={handleMarkHelpful}
                      onReport={handleReportReview}
                      onReviewUpdated={handleReviewSubmitted}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
              <p className="text-lg font-semibold text-gray-900">
                No reviews yet
              </p>
              <p className="mt-2">Be the first to review this product.</p>
            </div>
          )}

          <ReviewPagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={setPage}
            disabled={isLoadingState}
          />

          <WriteReviewForm
            productId={productId}
            isAuthenticated={isAuthenticated}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
