import { createSlice } from "@reduxjs/toolkit";
import { loadGuestWishlist } from "./wishlistStorage";

/**
 * Guest wishlist item shape (client state):
 * { productId: string, product: object | null }
 *
 * When authenticated the server is source of truth — this slice
 * only holds guest (unauthenticated) items.
 */
const initialState = {
  items: loadGuestWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** Add an item if not already present (no duplicates by productId). */
    addWishlistItem(state, action) {
      const { productId, product } = action.payload ?? {};
      if (!productId) return;
      const already = state.items.some(
        (i) => String(i.productId) === String(productId)
      );
      if (!already) {
        state.items.push({ productId, product: product ?? null });
      }
    },

    /** Remove an item by productId. */
    removeWishlistItem(state, action) {
      const productId = action.payload;
      if (!productId) return;
      state.items = state.items.filter(
        (i) => String(i.productId) !== String(productId)
      );
    },

    /** Toggle: add if absent, remove if present. Returns the new state. */
    toggleWishlistItem(state, action) {
      const { productId, product } = action.payload ?? {};
      if (!productId) return;
      const idx = state.items.findIndex(
        (i) => String(i.productId) === String(productId)
      );
      if (idx !== -1) {
        state.items.splice(idx, 1);
      } else {
        state.items.push({ productId, product: product ?? null });
      }
    },

    /** Replace the entire guest wishlist (used during guest → auth sync). */
    replaceWishlist(state, action) {
      state.items = Array.isArray(action.payload)
        ? action.payload.filter(Boolean)
        : [];
    },

    /** Clear all guest items (called after successful server sync on login). */
    clearGuestWishlistItems(state) {
      state.items = [];
    },
  },
});

export const {
  addWishlistItem,
  removeWishlistItem,
  toggleWishlistItem,
  replaceWishlist,
  clearGuestWishlistItems,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
