import { baseApi } from "../../store/api/baseApi";

const normalizeCartItem = (item) => {
  if (!item || typeof item !== "object") return null;
  const productId = item.productId ?? item.product?._id ?? item.product ?? null;
  const imageValue =
    typeof item.image === "string"
      ? item.image
      : Array.isArray(item.image)
        ? item.image[0]
        : item.product?.image?.[0] ?? null;

  return {
    ...item,
    _id: item._id ?? null,
    productId,
    product: {
      _id: productId,
      name: item.name ?? item.product?.name ?? "",
      price: Number(item.price ?? item.product?.price) || 0,
      image: imageValue ? [imageValue] : [],
    },
  };
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({ url: "/api/cart", method: "GET" }),
      transformResponse: (response) => {
        const cart = response?.cart ?? response ?? {};
        const rawItems = Array.isArray(cart?.items) ? cart.items : [];
        return {
          ...cart,
          items: rawItems.map(normalizeCartItem).filter(Boolean),
          subtotal: Number(cart?.subtotal) || 0,
          discount: Number(cart?.discount) || 0,
          tax: Number(cart?.tax) || 0,
          shipping: Number(cart?.shipping) || 0,
          total: Number(cart?.total) || 0,
        };
      },
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation({
      query: ({ productId, quantity = 1, size, color }) => ({
        url: "/api/cart/add",
        method: "POST",
        body: { productId, quantity, size, color },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, productId, quantity, size, color }) => ({
        url: "/api/cart/item",
        method: "PUT",
        body: { itemId, productId, quantity, size, color },
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

