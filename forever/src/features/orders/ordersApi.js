import { baseApi } from "../../store/api/baseApi";

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: "/api/order",
                params: { page, limit },
            }),
            providesTags: (result) =>
                result?.orders?.length
                    ? result.orders.map((order) => ({ type: "Orders", id: order._id ?? order.id }))
                    : [{ type: "Orders", id: "LIST" }],
        }),
        placeOrder: builder.mutation({
            query: (payload) => ({
                url: "/api/order",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Cart", "Orders"],
        }),
    }),
});

export const { useGetOrdersQuery, usePlaceOrderMutation } = ordersApi;
