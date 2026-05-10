import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action) {
      const payload = action.payload ?? {};
      const orderItems = Array.isArray(payload.items) ? payload.items.filter(Boolean) : [];
      if (!orderItems.length) return;

      state.orders.unshift({
        id: payload._id ?? payload.id ?? `ORD-${Date.now()}`,
        items: orderItems,
        summary: payload.summary ?? {},
        shippingInfo: payload.shippingAddress ?? payload.shippingInfo ?? {},
        billingAddress: payload.billingAddress ?? {},
        paymentMethod: payload.paymentMethod ?? "cod",
        status: payload.status ?? "Order placed",
        notes: payload.notes ?? "",
        createdAt: payload.createdAt ?? new Date().toISOString(),
      });
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

