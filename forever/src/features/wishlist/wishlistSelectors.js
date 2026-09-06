import { createSelector } from "@reduxjs/toolkit";
import { wishlistApi } from "./wishlistApi";

// ── Raw slice selectors ───────────────────────────────────────────────────────

const selectWishlistSlice = (state) => state.wishlist;

export const selectGuestWishlistItems = createSelector(
  [selectWishlistSlice],
  (wishlist) => (Array.isArray(wishlist?.items) ? wishlist.items : [])
);

export const selectIsAuthenticated = (state) =>
  Boolean(state.auth?.isAuthenticated);

// ── Server (RTK Query) selectors ─────────────────────────────────────────────

export const selectServerWishlistResult =
  wishlistApi.endpoints.getWishlist.select();

export const selectServerWishlist = createSelector(
  [selectServerWishlistResult],
  (res) => res?.data ?? null
);

export const selectServerWishlistItems = createSelector(
  [selectServerWishlistResult],
  (res) => {
    const items = res?.data?.items ?? [];
    return Array.isArray(items) ? items.filter(Boolean) : [];
  }
);

// ── Unified selectors (guest vs server) ──────────────────────────────────────

/**
 * Active wishlist items — server items when authed, guest items otherwise.
 * Each item: { productId, product: { _id, name, price, images, ... } }
 */
export const selectWishlistItems = createSelector(
  [selectIsAuthenticated, selectGuestWishlistItems, selectServerWishlistItems],
  (authed, guestItems, serverItems) => (authed ? serverItems : guestItems)
);

/**
 * Flat array of productId strings currently in the wishlist.
 * Used by ProductItem, QuickViewModal, etc. for `isFav` checks.
 */
export const selectWishlistIds = createSelector(
  [selectWishlistItems],
  (items) =>
    items
      .map((i) => i?.productId ?? i?.product?._id ?? null)
      .filter(Boolean)
);

/** Total number of wishlisted items for the badge counter. */
export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);
