import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "Profile"],
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/users/me",
      transformResponse: (response) => response?.data || response,
      providesTags: ["Profile"],
    }),
    updateMyProfile: builder.mutation({
      query: (profile) => ({
        url: "/users/me",
        method: "PUT",
        body: profile,
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ["Profile"],
    }),
    changeMyPassword: builder.mutation({
      query: (passwords) => ({
        url: "/users/me/password",
        method: "PATCH",
        body: passwords,
      }),
    }),
    getUsers: builder.query({
      query: ({ page = 0, size = 10 } = {}) => `/users?page=${page}&size=${size}`,
      transformResponse: (response) => response?.data || response,
      providesTags: ["Users"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangeMyPasswordMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} = usersApi;

export default usersApi;
