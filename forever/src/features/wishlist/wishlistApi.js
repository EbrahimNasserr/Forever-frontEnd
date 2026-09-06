import { baseApi } from "../../store/api/baseApi";

/**
 * Normalise a single wishlist item from the server response.
 *
 * The API returns flat items where product data lives directly on the item:
 * {
 *   product: "<id string>",   // productId
 *   name:    "...",
 *   image:   "https://...",   // single string OR array
 *   price:   500,
 *   addedAt: "...",
 * }
 *
 * We also handle the fully-populated variant in case the backend changes:
 * { product: { _id, name, price, images, isActive }, ... }
 */
const normalizeWishlistItem = (item) => {
  if (!item || typeof item !== "object") return null;

  // Determine whether product is a populated object or just an ID string
  const isPopulated =
    item.product !== null &&
    typeof item.product === "object" &&
    !Array.isArray(item.product);

  // productId — either the nested _id or the raw string
  const productId = isPopulated
    ? (item.product._id ?? null)
    : (typeof item.product === "string" ? item.product : null);

  if (!productId) return null;

  // Resolve name / price from item root (flat) or nested product (populated)
  const name = item.name ?? (isPopulated ? item.product.name : "") ?? "";
  const price = Number(item.price ?? (isPopulated ? item.product.price : 0)) || 0;
  const isActive = isPopulated ? (item.product.isActive ?? true) : true;

  // Normalise image(s) — single string or array, under item.image / item.images
  // or nested product.image / product.images
  const rawImage = item.image
    ?? item.images
    ?? (isPopulated ? (item.product.image ?? item.product.images) : null);

  const images = Array.isArray(rawImage)
    ? rawImage.filter(Boolean)
    : typeof rawImage === "string" && rawImage
      ? [rawImage]
      : [];

  return {
    _id: item._id ?? null,
    productId,
    addedAt: item.addedAt ?? null,
    product: {
      // Spread any extra fields from the populated object (category, sizes, etc.)
      ...(isPopulated ? item.product : {}),
      _id: productId,
      name,
      price,
      images,
      image: images, // alias so components using product.image[] still work
      isActive,
    },
  };
};

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/wishlist — fetch the authenticated user's wishlist */
    getWishlist: builder.query({
      query: () => ({ url: "/api/wishlist", method: "GET" }),
      transformResponse: (response) => {
        const wishlist = response?.wishlist ?? response ?? {};
        const rawItems = Array.isArray(wishlist?.items) ? wishlist.items : [];
        return {
          ...wishlist,
          items: rawItems.map(normalizeWishlistItem).filter(Boolean),
        };
      },
      providesTags: ["Wishlist"],
    }),

    /** POST /api/wishlist/add — add a product to the wishlist */
    addWishlistItem: builder.mutation({
      query: ({ productId }) => ({
        url: "/api/wishlist/add",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /** DELETE /api/wishlist/item/:productId — remove one item */
    removeWishlistItem: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/item/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /** DELETE /api/wishlist/clear — remove all items */
    clearWishlist: builder.mutation({
      query: () => ({ url: "/api/wishlist/clear", method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;
