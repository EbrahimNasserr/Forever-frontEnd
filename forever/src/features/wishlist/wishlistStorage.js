const GUEST_WISHLIST_KEY = "fc_guest_wishlist_v1";

/**
 * Guest wishlist item shape:
 * { productId: string, product: object | null }
 */

export function loadGuestWishlist() {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function saveGuestWishlist(items) {
  try {
    localStorage.setItem(
      GUEST_WISHLIST_KEY,
      JSON.stringify(Array.isArray(items) ? items : [])
    );
  } catch {
    // ignore storage failures
  }
}

export function clearGuestWishlist() {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // ignore
  }
}
