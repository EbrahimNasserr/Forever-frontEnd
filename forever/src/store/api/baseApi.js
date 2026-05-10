import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAccessToken, getAccessToken } from "../tokenStorage";
import { clearStoredUser } from "../authStorage";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuthRedirect = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const message = String(result.error?.data?.message || result.error?.error || "").toLowerCase();
    const shouldRedirect =
      message.includes("token") || message.includes("expired") || message.includes("unauthorized");

    if (shouldRedirect) {
      clearAccessToken();
      clearStoredUser();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthRedirect,
  tagTypes: ["Auth", "Cart", "Products", "Orders", "Wishlist", "Reviews"],
  endpoints: () => ({}),
});

