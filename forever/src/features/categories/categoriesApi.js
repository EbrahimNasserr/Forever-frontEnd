import { baseApi } from "../../store/api/baseApi";

const normalizeCategoriesResponse = (response) => {
    const payload = response?.categories ? response : response?.data ? response.data : response;

    const categories = Array.isArray(payload?.categories)
        ? payload.categories
        : Array.isArray(payload)
            ? payload
            : [];

    return {
        count: typeof payload?.count === "number" ? payload.count : categories.length,
        categories,
    };
};

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({ url: "/api/category", method: "GET" }),
            transformResponse: (response) => normalizeCategoriesResponse(response),
            providesTags: (result) =>
                result?.categories?.length
                    ? [
                        ...result.categories.map((c) => ({ type: "Categories", id: c._id })),
                        { type: "Categories", id: "LIST" },
                    ]
                    : [{ type: "Categories", id: "LIST" }],
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;

