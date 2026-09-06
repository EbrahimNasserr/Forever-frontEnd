import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addWishlistItem,
  clearGuestWishlistItems,
  removeWishlistItem,
  replaceWishlist,
  toggleWishlistItem,
} from "./wishlistSlice";
import { saveGuestWishlist } from "./wishlistStorage";

export const wishlistListenerMiddleware = createListenerMiddleware();

let persistTimer = null;

wishlistListenerMiddleware.startListening({
  matcher: isAnyOf(
    addWishlistItem,
    removeWishlistItem,
    toggleWishlistItem,
    clearGuestWishlistItems,
    replaceWishlist
  ),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    // Only persist guest state — server is source of truth when authed
    const isAuthenticated = Boolean(state.auth?.isAuthenticated);
    if (isAuthenticated) return;

    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      const latestState = listenerApi.getState();
      saveGuestWishlist(latestState.wishlist?.items ?? []);
    }, 150);
  },
});
