import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "forever_wishlist";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage quota exceeded or private mode — fail silently
  }
};

/**
 * Lightweight wishlist backed by localStorage.
 * Stores an array of product _id strings.
 */
export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState(load);

  // Persist whenever ids change
  useEffect(() => {
    save(wishlistIds);
  }, [wishlistIds]);

  const toggle = useCallback((productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const clear = useCallback(() => setWishlistIds([]), []);

  return { wishlistIds, toggle, isInWishlist, clear, count: wishlistIds.length };
}
