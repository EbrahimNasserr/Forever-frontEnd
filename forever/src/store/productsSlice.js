import { createSlice } from "@reduxjs/toolkit";
import { products as seedProducts } from "../assets/assets";

const initialState = {
  items: seedProducts,
  cart: [],
  orders: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const { productId, size, quantity = 1, product } = action.payload ?? {};
      if (!productId) return;

      const safeQty = Number.isFinite(Number(quantity)) ? Number(quantity) : 1;
      const qty = Math.max(1, Math.floor(safeQty));
      const keySize = size ?? "";

      const existing = state.cart.find(
        (i) => String(i.productId) === String(productId) && String(i.size) === String(keySize)
      );

      if (existing) {
        existing.quantity += qty;
      } else {
        state.cart.push({
          productId,
          size: keySize,
          quantity: qty,
          product: product ?? null,
        });
      }
    },
    removeFromCart(state, action) {
      const { productId, size } = action.payload ?? {};
      state.cart = state.cart.filter(
        (i) =>
          !(
            String(i.productId) === String(productId) &&
            String(i.size) === String(size ?? "")
          )
      );
    },
    setCartItemQuantity(state, action) {
      const { productId, size, quantity } = action.payload ?? {};
      const item = state.cart.find(
        (i) =>
          String(i.productId) === String(productId) &&
          String(i.size) === String(size ?? "")
      );
      if (!item) return;
      const q = Number(quantity);
      if (!Number.isFinite(q) || q <= 0) {
        state.cart = state.cart.filter((i) => i !== item);
        return;
      }
      item.quantity = Math.floor(q);
    },
    clearCart(state) {
      state.cart = [];
    },
    placeOrder(state, action) {
      const payload = action.payload ?? {};
      const orderItems = Array.isArray(payload.items)
        ? payload.items.filter(Boolean)
        : [];
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
      state.cart = [];
    },
  },
});

export const {
  setProducts,
  addToCart,
  removeFromCart,
  setCartItemQuantity,
  clearCart,
  placeOrder,
} = productsSlice.actions;
export default productsSlice.reducer;

