import { createSelector } from "@reduxjs/toolkit";
import { cartApi } from "./cartApi";

const selectCartSlice = (state) => state.cart;
export const selectGuestCartItems = createSelector(
  [selectCartSlice],
  (cart) => (Array.isArray(cart?.items) ? cart.items : [])
);

export const selectIsAuthenticated = (state) => Boolean(state.auth?.isAuthenticated);

export const selectServerCartResult = cartApi.endpoints.getCart.select();

export const selectServerCartItems = createSelector([selectServerCartResult], (res) => {
  const data = res?.data;
  const items = data?.items ?? data?.cartItems ?? data ?? null;
  return Array.isArray(items) ? items.filter(Boolean) : [];
});

export const selectCartItems = createSelector(
  [selectIsAuthenticated, selectGuestCartItems, selectServerCartItems],
  (authed, guestItems, serverItems) => (authed ? serverItems : guestItems)
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
);

