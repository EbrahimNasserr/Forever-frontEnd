import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder(state, action) {
      const payload = action.payload ?? {};
      const orderItems = Array.isArray(payload.items) ? payload.items.filter(Boolean) : [];
      if (!orderItems.length) return;

      state.orders.unshift({
        id: payload.id ?? `ORD-${Date.now()}`,
        items: orderItems,
        summary: payload.summary ?? {},
        shippingInfo: payload.shippingInfo ?? {},
        paymentMethod: payload.paymentMethod ?? "cod",
        status: payload.status ?? "Order placed",
        createdAt: payload.createdAt ?? new Date().toISOString(),
      });
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

