import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../api/baseQuery";
import { UserDto } from "@/utils/models/user.model";
import { USER } from "../api/apiEndPoints";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // READ: Get all users
    getUsers: builder.query<UserDto[], void>({
      query: () => USER,
      providesTags: ["User"],
    }),

    // READ: Get single user
    getUserById: builder.query<UserDto, number>({
      query: (id) => `${USER}/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // CREATE: Add a new user
    createUser: builder.mutation<UserDto, Partial<UserDto>>({
      query: (newUser) => ({
        url: USER,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),

    // UPDATE: Update a user
    updateUser: builder.mutation<
      UserDto,
      { id: number; data: Partial<UserDto> }
    >({
      query: ({ id, data }) => ({
        url: `${USER}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
