import { baseApi } from "../../store/api/baseApi";

const normalizeProduct = (product) => {
  if (!product || typeof product !== "object") return null;
  return {
    ...product,
    image: Array.isArray(product.image)
      ? product.image
      : Array.isArray(product.images)
        ? product.images
        : [],
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : Array.isArray(product.size)
        ? product.size
        : [],
    colors: Array.isArray(product.colors)
      ? product.colors
      : Array.isArray(product.color)
        ? product.color
        : [],
    bestseller:
      typeof product.bestseller === "boolean"
        ? product.bestseller
        : Boolean(product.bestSeller),
    date:
      typeof product.date === "string"
        ? Date.parse(product.date) || Date.now()
        : Number(product.date) || Date.now(),
  };
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (category) => ({
        url: "/api/product/all",
        method: "GET",
        ...(category ? { params: { category } } : {}),
      }),
      transformResponse: (response) => {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : response?.product
              ? [response.product]
              : [];
        return list.map(normalizeProduct).filter(Boolean);
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            ...result.map((p) => ({ type: "Products", id: p._id })),
            { type: "Products", id: "LIST" },
          ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => ({ url: `/api/product/${id}`, method: "GET" }),
      transformResponse: (response) => {
        const raw = response?.product ?? response;
        return normalizeProduct(raw);
      },
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductByIdQuery } = productsApi;

