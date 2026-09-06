import { clearGuestWishlist, loadGuestWishlist } from "./wishlistStorage";
import { clearGuestWishlistItems } from "./wishlistSlice";
import { wishlistApi } from "./wishlistApi";

/**
 * Login sync flow (guest → server):
 * 1. Read guest wishlist from localStorage
 * 2. POST each productId to the server (server deduplicates)
 * 3. Clear localStorage guest wishlist
 * 4. Clear the Redux guest slice
 * 5. Invalidate the server Wishlist cache so it refetches
 */
export const syncGuestWishlistAfterAuth = () => async (dispatch, getState) => {
  const state = getState();
  const isAuthenticated = Boolean(state.auth?.isAuthenticated);
  if (!isAuthenticated) return;

  const guestItems = loadGuestWishlist();

  if (!guestItems.length) {
    // Nothing to sync — just make sure server data is fresh
    dispatch(wishlistApi.util.invalidateTags(["Wishlist"]));
    return;
  }

  // Best-effort: add each guest item to the server wishlist
  for (const item of guestItems) {
    const productId = item?.productId;
    if (!productId) continue;
    try {
      await dispatch(
        wishlistApi.endpoints.addWishlistItem.initiate({ productId })
      ).unwrap();
    } catch {
      // Continue syncing remaining items even if one fails
    }
  }

  clearGuestWishlist();
  dispatch(clearGuestWishlistItems());
  dispatch(wishlistApi.util.invalidateTags(["Wishlist"]));
};
