import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addItem, clearCart, removeItem, replaceCart, setItemQuantity } from "./cartSlice";
import { saveGuestCart } from "./cartStorage";

export const cartListenerMiddleware = createListenerMiddleware();

let persistTimer = null;

cartListenerMiddleware.startListening({
  matcher: isAnyOf(addItem, removeItem, setItemQuantity, clearCart, replaceCart),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const isAuthenticated = Boolean(state.auth?.isAuthenticated);
    if (isAuthenticated) return;

    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      const latestState = listenerApi.getState();
      saveGuestCart(latestState.cart?.items);
    }, 150);
  },
});

