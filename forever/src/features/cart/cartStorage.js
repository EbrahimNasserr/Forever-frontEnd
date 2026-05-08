const GUEST_CART_KEY = "fc_guest_cart_v1";

export function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  } catch {
    // ignore
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // ignore
  }
}

