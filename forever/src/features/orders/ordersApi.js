import { baseApi } from "../../store/api/baseApi";

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

export const { usePlaceOrderMutation } = ordersApi;
