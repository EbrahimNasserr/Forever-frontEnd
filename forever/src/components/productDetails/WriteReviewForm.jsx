import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateReviewMutation } from "../../features/reviews/reviewsApi";

const ratingStars = [5, 4, 3, 2, 1];

const WriteReviewForm = ({ productId, isAuthenticated, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!rating) {
      setErrorMessage("Please select a rating before submitting.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Please write a review comment.");
      return;
    }

    try {
      await createReview({ productId, rating, title, comment }).unwrap();
      toast.success("Review submitted");
      setRating(0);
      setTitle("");
      setComment("");
      setSubmitted(true);
      onReviewSubmitted?.();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to submit review.";
      setErrorMessage(message);
    }
  };

  const starButtons = useMemo(
    () =>
      ratingStars.map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => setRating(value)}
          className={`inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-semibold transition ${
            rating === value
              ? "bg-gray-900 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:border-gray-900 hover:bg-gray-50"
          }`}
          aria-label={`${value} star rating`}
        >
          <Star
            className={
              rating >= value ? "size-4 text-amber-500" : "size-4 text-gray-300"
            }
            fill={rating >= value ? "currentColor" : "none"}
            aria-hidden
          />
          <span className="ml-2">{value}</span>
        </button>
      )),
    [rating],
  );

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-gray-900">Write a review</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Sign in to write a review for this product.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Sign in to review
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Write a review
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Share your experience and help others shop with confidence.
          </p>
        </div>
        {submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Write another review
          </button>
        ) : null}
      </div>

      {submitted ? (
        <div className="mt-6 rounded-3xl bg-emerald-50 p-6 text-sm text-emerald-800">
          Thank you for your feedback! Your review will appear once it is
          processed.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="mt-3 flex flex-wrap gap-2">{starButtons}</div>
          </div>

          <div>
            <label
              htmlFor="review-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="review-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Short summary of your review"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={5}
              placeholder="Tell us what you liked or disliked about the product"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {errorMessage ? (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default WriteReviewForm;
