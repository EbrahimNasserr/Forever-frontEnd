const AUTH_USER_KEY = "fc_auth_user";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (!user) return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}

