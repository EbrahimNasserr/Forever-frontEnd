/**
 * Derive up-to-two uppercase initials from a name string or
 * separate first/last name fields.
 */
export const getInitials = (name = "", lastName = "") => {
  if (lastName) {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  return parts[0]?.charAt(0).toUpperCase() ?? "?";
};

/**
 * Parse a user object from the Redux store into convenient display fields.
 * The server stores the full name as a single `name` field.
 */
export const parseUserName = (user) => {
  if (!user) return { firstName: "", lastName: "", fullName: "" };
  const full = user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const parts = full.split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName, fullName: full };
};

/**
 * Format a date string/ISO timestamp for "Member since" display.
 */
export const formatMemberSince = (value) => {
  if (!value) return "Recently";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};
