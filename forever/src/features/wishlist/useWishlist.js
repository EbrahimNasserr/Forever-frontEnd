import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} from "./wishlistApi";
import {
  toggleWishlistItem,
  clearGuestWishlistItems,
} from "./wishlistSlice";
import {
  selectIsAuthenticated,
  selectWishlistIds,
  selectWishlistItems,
  selectWishlistCount,
} from "./wishlistSelectors";

/**
 * useWishlist — unified wishlist hook (guest + authenticated).
 *
 * Guest mode  : items live in Redux slice, persisted to localStorage.
 * Authed mode : server is source of truth via RTK Query; slice is bypassed.
 *
 * Public API:
 *   items       — full item objects [{ productId, product }]
 *   wishlistIds — flat string[] of productId values (for isFav checks)
 *   count       — number of items
 *   isLoading   — true while initial server fetch is in flight
 *   toggle(productId, product?) — add / remove (toasts included)
 *   remove(productId)          — explicit remove
 *   clear()                    — clear all items
 *   isInWishlist(productId)    — boolean helper
 */
export function useWishlist() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Always fire the query; it skips automatically when not authed
  const { isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addServer] = useAddWishlistItemMutation();
  const [removeServer] = useRemoveWishlistItemMutation();
  const [clearServer] = useClearWishlistMutation();

  // Selectors resolve guest vs server automatically
  const items = useSelector(selectWishlistItems);
  const wishlistIds = useSelector(selectWishlistIds);
  const count = useSelector(selectWishlistCount);

  /* ── toggle ─────────────────────────────────────────────────────────────── */
  const toggle = useCallback(
    async (productId, product = null) => {
      if (!productId) return;

      const alreadyIn = wishlistIds.includes(String(productId));

      if (!isAuthenticated) {
        // Guest: mutate Redux slice (listener persists to localStorage)
        dispatch(toggleWishlistItem({ productId, product }));
        toast[alreadyIn ? "info" : "success"](
          alreadyIn ? "Removed from wishlist" : "Added to wishlist"
        );
        return;
      }

      // Authenticated: call the API
      try {
        if (alreadyIn) {
          await removeServer(productId).unwrap();
          toast.info("Removed from wishlist");
        } else {
          await addServer({ productId }).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (err) {
        toast.error(
          err?.data?.message ?? err?.message ?? "Wishlist update failed"
        );
      }
    },
    [addServer, dispatch, isAuthenticated, removeServer, wishlistIds]
  );

  /* ── remove ──────────────────────────────────────────────────────────────── */
  const remove = useCallback(
    async (productId) => {
      if (!productId) return;

      if (!isAuthenticated) {
        dispatch(toggleWishlistItem({ productId }));
        return;
      }

      try {
        await removeServer(productId).unwrap();
        toast.info("Removed from wishlist");
      } catch (err) {
        toast.error(
          err?.data?.message ?? err?.message ?? "Could not remove item"
        );
      }
    },
    [dispatch, isAuthenticated, removeServer]
  );

  /* ── clear ───────────────────────────────────────────────────────────────── */
  const clear = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(clearGuestWishlistItems());
      return;
    }
    try {
      await clearServer().unwrap();
      toast.info("Wishlist cleared");
    } catch (err) {
      toast.error(
        err?.data?.message ?? err?.message ?? "Could not clear wishlist"
      );
    }
  }, [clearServer, dispatch, isAuthenticated]);

  /* ── isInWishlist helper ─────────────────────────────────────────────────── */
  const isInWishlist = useCallback(
    (productId) => wishlistIds.includes(String(productId)),
    [wishlistIds]
  );

  return {
    items,
    wishlistIds,
    count,
    isLoading,
    toggle,
    remove,
    clear,
    isInWishlist,
  };
}
