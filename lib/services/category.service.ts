import { UserDto } from '@/utils/models/user.model';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ALL, CATEGORIES, USER } from '../api/apiEndPoints';
import { baseQuery } from '../api/baseQuery';
import { CategoryDetailsDto } from '@/utils/models/category.model';
import { TopBrandsDto } from '@/utils/models/brand.model';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // READ: Get all users
    getCategories: builder.query<CategoryDetailsDto[], void>({
      query: () => CATEGORIES + ALL,
      providesTags: ['Category'],
    }),

    // READ: Get single user
    getTopBrandsBySubCategory: builder.query<TopBrandsDto, string>({
      query: (id) => `${CATEGORIES}/${id}/top-brands`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // CREATE: Add a new user
    createUser: builder.mutation<UserDto, Partial<UserDto>>({
      query: (newUser) => ({
        url: USER,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Category'],
    }),

    // UPDATE: Update a user
    updateUser: builder.mutation<
      UserDto,
      { id: number; data: Partial<UserDto> }
    >({
      query: ({ id, data }) => ({
        url: `${USER}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${USER}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetTopBrandsBySubCategoryQuery,
  useLazyGetTopBrandsBySubCategoryQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLazyGetCategoriesQuery,
} = categoryApi;
