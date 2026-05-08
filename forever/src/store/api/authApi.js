import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/api/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/api/auth/register",
        method: "POST",
        body: { name, email, password },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

