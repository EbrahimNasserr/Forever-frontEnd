import { baseApi } from "../../store/api/baseApi";

const buildReviewQueryUrl = ({ productId, page, limit, sort, rating }) => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.set("page", page);
    if (limit) searchParams.set("limit", limit);
    if (sort) searchParams.set("sort", sort);
    if (rating) searchParams.set("rating", rating);

    return `/api/reviews/product/${productId}?${searchParams.toString()}`;
};

export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: ({ productId, page, limit, sort, rating }) => ({
                url: buildReviewQueryUrl({ productId, page, limit, sort, rating }),
                method: "GET",
            }),
            providesTags: (result, error, arg) =>
                result?.reviews
                    ? [
                        ...result.reviews.map((review) => ({
                            type: "Reviews",
                            id: review._id,
                        })),
                        { type: "Reviews", id: `PRODUCT_${arg.productId}` },
                    ]
                    : [{ type: "Reviews", id: `PRODUCT_${arg.productId}` }],
        }),
        createReview: builder.mutation({
            query: ({ productId, rating, title, comment }) => ({
                url: "/api/reviews",
                method: "POST",
                body: { productId, rating, title, comment },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Reviews", id: `PRODUCT_${arg.productId}` },
            ],
        }),
        markHelpful: builder.mutation({
            query: ({ reviewId }) => ({
                url: `/api/reviews/${reviewId}/helpful`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Reviews", id: `PRODUCT_${arg.productId}` },
                { type: "Reviews", id: arg.reviewId },
            ],
        }),
        reportReview: builder.mutation({
            query: ({ reviewId }) => ({
                url: `/api/reviews/${reviewId}/report`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Reviews", id: `PRODUCT_${arg.productId}` },
                { type: "Reviews", id: arg.reviewId },
            ],
        }),
        updateReview: builder.mutation({
            query: ({ reviewId, rating, title, comment }) => ({
                url: `/api/reviews/${reviewId}`,
                method: "PUT",
                body: { rating, title, comment },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Reviews", id: arg.reviewId },
            ],
        }),
        deleteReview: builder.mutation({
            query: ({ reviewId }) => ({
                url: `/api/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Reviews", id: arg.reviewId },
            ],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useMarkHelpfulMutation,
    useReportReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewsApi;
