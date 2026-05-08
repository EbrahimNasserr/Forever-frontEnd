import { baseApi } from "../../store/api/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({ url: "/api/cart", method: "GET" }),
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation({
      query: ({ productId, quantity = 1, size }) => ({
        url: "/api/cart/add",
        method: "POST",
        body: { productId, quantity, size },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: "/api/cart/item",
        method: "PUT",
        body: { itemId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `/api/cart/item/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({ url: "/api/cart/clear", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;

