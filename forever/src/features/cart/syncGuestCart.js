import { clearGuestCart, loadGuestCart } from "./cartStorage";
import { clearCart as clearGuestCartSlice } from "./cartSlice";
import { cartApi } from "./cartApi";

/**
 * Login sync flow (guest -> server):
 * - Read guest cart from localStorage
 * - Add each item to backend cart (backend merges / increments)
 * - Clear localStorage guest cart
 * - Clear guest cart slice
 * - Refetch server cart
 */
export const syncGuestCartAfterAuth = () => async (dispatch, getState) => {
  const state = getState();
  const isAuthenticated = Boolean(state.auth?.isAuthenticated);
  if (!isAuthenticated) return;

  const guestItems = loadGuestCart();
  if (!guestItems.length) {
    dispatch(cartApi.util.invalidateTags(["Cart"]));
    return;
  }

  for (const item of guestItems) {
    const productId = item?.productId;
    if (!productId) continue;
    const quantity = Number(item?.quantity) || 1;
    const size = item?.size ?? "";
    try {
      // fire-and-wait to keep backend consistent, then rely on refetch
      await dispatch(
        cartApi.endpoints.addCartItem.initiate({ productId, quantity, size })
      ).unwrap();
    } catch {
      // best-effort sync: continue syncing remaining items
    }
  }

  clearGuestCart();
  dispatch(clearGuestCartSlice());
  dispatch(cartApi.util.invalidateTags(["Cart"]));
};

