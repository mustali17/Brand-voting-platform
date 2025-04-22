import {
  BrandDetailsDto,
  BrandDto,
  BrandFormDto,
} from "@/utils/models/brand.model";
import { createApi } from "@reduxjs/toolkit/query/react";
import { BRANDS, REGISTER } from "../api/apiEndPoints";
import { baseQuery } from "../api/baseQuery";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery,
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    // READ: Get all users
    getUsers: builder.query<BrandFormDto[], void>({
      query: () => BRANDS,
      providesTags: ["Brand"],
    }),

    // READ: Get single user
    getBrandById: builder.query<BrandDetailsDto, string>({
      query: (id) => `${BRANDS}/${id}`,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    // CREATE: Add a new brand
    createBrand: builder.mutation<BrandFormDto, Partial<BrandFormDto>>({
      query: (newUser) => ({
        url: BRANDS + REGISTER,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Brand"],
    }),

    // UPDATE: Update a user
    updateBrand: builder.mutation<
      BrandDto,
      { id: string; data: Partial<BrandDto> }
    >({
      query: ({ id, data }) => ({
        url: `${BRANDS}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Brand", id }],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${BRANDS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetBrandByIdQuery,
  useLazyGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteUserMutation,
} = brandApi;
