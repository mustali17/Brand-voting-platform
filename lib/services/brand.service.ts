import { BrandDto } from '@/utils/models/brand.model';
import { createApi } from '@reduxjs/toolkit/query/react';
import { BRANDS, REGISTER } from '../api/apiEndPoints';
import { baseQuery } from '../api/baseQuery';

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery,
  tagTypes: ['Brand'],
  endpoints: (builder) => ({
    // READ: Get all users
    getUsers: builder.query<BrandDto[], void>({
      query: () => BRANDS,
      providesTags: ['Brand'],
    }),

    // READ: Get single user
    getUserById: builder.query<BrandDto, number>({
      query: (id) => `${BRANDS}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),

    // CREATE: Add a new brand
    createBrand: builder.mutation<BrandDto, Partial<BrandDto>>({
      query: (newUser) => ({
        url: BRANDS + REGISTER,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Brand'],
    }),

    // UPDATE: Update a user
    updateUser: builder.mutation<
      BrandDto,
      { id: number; data: Partial<BrandDto> }
    >({
      query: ({ id, data }) => ({
        url: `${BRANDS}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${BRANDS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateBrandMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = brandApi;
