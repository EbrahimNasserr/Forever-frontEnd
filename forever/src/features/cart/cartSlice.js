import { createSlice } from "@reduxjs/toolkit";
import { loadGuestCart } from "./cartStorage";

// Guest cart item shape (client state)
// { productId: string, size: string, quantity: number, product?: object|null }

const initialState = {
  items: loadGuestCart(),
  ui: {
    isCartOpen: false,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartOpen(state, action) {
      state.ui.isCartOpen = Boolean(action.payload);
    },
    addItem(state, action) {
      const { productId, size, quantity = 1, product } = action.payload ?? {};
      if (!productId) return;

      const safeQty = Number.isFinite(Number(quantity)) ? Number(quantity) : 1;
      const qty = Math.max(1, Math.floor(safeQty));
      const keySize = size ?? "";

      const existing = state.items.find(
        (i) =>
          String(i.productId) === String(productId) &&
          String(i.size ?? "") === String(keySize)
      );

      if (existing) existing.quantity += qty;
      else {
        state.items.push({
          productId,
          size: keySize,
          quantity: qty,
          product: product ?? null,
        });
      }
    },
    removeItem(state, action) {
      const { productId, size } = action.payload ?? {};
      state.items = state.items.filter(
        (i) =>
          !(
            String(i.productId) === String(productId) &&
            String(i.size ?? "") === String(size ?? "")
          )
      );
    },
    setItemQuantity(state, action) {
      const { productId, size, quantity } = action.payload ?? {};
      const item = state.items.find(
        (i) =>
          String(i.productId) === String(productId) &&
          String(i.size ?? "") === String(size ?? "")
      );
      if (!item) return;

      const q = Number(quantity);
      if (!Number.isFinite(q) || q <= 0) {
        state.items = state.items.filter((i) => i !== item);
        return;
      }
      item.quantity = Math.floor(q);
    },
    clearCart(state) {
      state.items = [];
    },
    replaceCart(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload.filter(Boolean) : [];
    },
  },
});

export const { setCartOpen, addItem, removeItem, setItemQuantity, clearCart, replaceCart } =
  cartSlice.actions;

export default cartSlice.reducer;

