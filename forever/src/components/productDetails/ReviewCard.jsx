import { memo, useState } from "react";
import { format } from "date-fns";
import { Star, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../../features/reviews/reviewsApi";

const ReviewCard = ({ review, onMarkHelpful, onReport, onReviewUpdated }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount ?? 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editTitle, setEditTitle] = useState(review.title ?? "");
  const [editComment, setEditComment] = useState(review.comment ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const name = review.user?.name || "Guest";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const createdAt = review.createdAt
    ? format(new Date(review.createdAt), "MMMM d, yyyy")
    : "";

  const updatedAt =
    review.updatedAt && review.updatedAt !== review.createdAt
      ? format(new Date(review.updatedAt), "MMMM d, yyyy")
      : null;

  const handleHelpful = async () => {
    if (hasMarkedHelpful) return;
    setHelpfulCount((count) => count + 1);
    setHasMarkedHelpful(true);

    try {
      await onMarkHelpful({ reviewId: review._id });
    } catch {
      setHelpfulCount((count) => Math.max(0, count - 1));
      setHasMarkedHelpful(false);
    }
  };

  const handleReport = async () => {
    if (hasReported) return;
    setHasReported(true);

    try {
      await onReport({ reviewId: review._id });
    } catch {
      setHasReported(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!editRating) {
      setErrorMessage("Please select a rating.");
      return;
    }

    if (!editComment.trim()) {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    try {
      await updateReview({
        reviewId: review._id,
        rating: editRating,
        title: editTitle,
        comment: editComment,
      }).unwrap();
      toast.success("Review updated successfully");
      setIsEditing(false);
      onReviewUpdated?.();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Failed to update review";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview({ reviewId: review._id }).unwrap();
      toast.success("Review deleted successfully");
      onReviewUpdated?.();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Failed to delete review";
      toast.error(message);
    }
  };

  if (isEditing) {
    return (
      <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-gray-900">Edit your review</p>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setEditRating(value)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    editRating === value
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-gray-900"
                  }`}
                >
                  <Star
                    className={
                      editRating >= value
                        ? "size-4 text-amber-500"
                        : "size-4 text-gray-300"
                    }
                    fill={editRating >= value ? "currentColor" : "none"}
                  />
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Review title (optional)"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label
              htmlFor="edit-comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="edit-comment"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              placeholder="Share your updated thoughts"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "Updating..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-sm font-semibold text-gray-900">
          {initials || "GU"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-semibold text-gray-900">{name}</p>
            {review.isVerifiedPurchase ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
                Verified purchase
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {createdAt}
            {updatedAt && (
              <span className="ml-2 text-gray-400">(edited {updatedAt})</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = review.rating >= index + 1;
          return (
            <Star
              key={index}
              className={
                filled ? "size-4 text-amber-500" : "size-4 text-gray-300"
              }
              fill={filled ? "currentColor" : "none"}
              aria-hidden
            />
          );
        })}
      </div>

      {review.title ? (
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {review.title}
        </h3>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-gray-600 whitespace-pre-line">
        {review.comment}
      </p>

      <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <span>{helpfulCount} people found this helpful</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleHelpful}
              disabled={hasMarkedHelpful}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                hasMarkedHelpful
                  ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-50"
              }`}
            >
              Helpful
            </button>
            <button
              type="button"
              onClick={handleReport}
              disabled={hasReported}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                hasReported
                  ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "border-gray-300 bg-white text-gray-900 hover:border-red-500 hover:text-red-600"
              }`}
            >
              {hasReported ? "Reported" : "Report"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
          >
            <Edit2 className="size-4" />
            Edit
          </button>
          {showDeleteConfirm ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-600 hover:bg-red-100"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(ReviewCard);
