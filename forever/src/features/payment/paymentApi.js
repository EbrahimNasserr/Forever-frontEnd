import { baseApi } from "../../store/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: ({ items, shippingAddress }) => ({
                url: "/api/payment/create-checkout-session",
                method: "POST",
                body: {
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                    shippingAddress,
                },
            }),
        }),
        verifyCheckoutSession: builder.query({
            query: (sessionId) => ({
                url: `/api/payment/verify/${sessionId}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateCheckoutSessionMutation,
    useVerifyCheckoutSessionQuery,
} = paymentApi;
