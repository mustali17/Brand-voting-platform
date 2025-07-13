import { UserDto } from "@/utils/models/user.model";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ADD_SUBCATEGORY,
  ALL,
  BRANDS,
  CATEGORIES,
  CREATE,
  USER,
} from "../api/apiEndPoints";
import { baseQuery } from "../api/baseQuery";
import {
  CategoryDetailsDto,
  CategoryFormDto,
  SubCategoryPostDto,
} from "@/utils/models/category.model";
import { TopBrandsDto } from "@/utils/models/brand.model";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // READ: Get all users
    getCategories: builder.query<CategoryDetailsDto[], void>({
      query: () => CATEGORIES + ALL,
      providesTags: ["Category"],
    }),

    // READ: Get single user
    getTopBrandsBySubCategory: builder.query<TopBrandsDto, string>({
      query: (id) => `${BRANDS}/top-by-subcategory/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // CREATE: Add a new category
    createCategory: builder.mutation<
      { success: boolean; category: CategoryDetailsDto },
      Partial<CategoryFormDto>
    >({
      query: (newUser) => ({
        url: CATEGORIES + CREATE,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Category"],
    }),
    // CREATE: Add a new sub category
    createSubCategory: builder.mutation<
      { success: boolean; category: CategoryDetailsDto },
      SubCategoryPostDto
    >({
      query: (newUser) => ({
        url: CATEGORIES + ADD_SUBCATEGORY,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Category"],
    }),

    // UPDATE: Update a user
    updateCategoryWithSub: builder.mutation<
      { success: boolean; category: CategoryDetailsDto },
      { id: string; data: Partial<CategoryFormDto> }
    >({
      query: ({ id, data }) => ({
        url: `${CATEGORIES}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Inside categoryApi endpoints
    toggleCategoryVisibility: builder.mutation<
      {
        success: boolean;
        message: string;
        categoryId: string;
        hidden: boolean;
      },
      string // categoryId
    >({
      query: (categoryId) => ({
        url: `${CATEGORIES}/${categoryId}/visibility`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Category" }, // Also invalidate the entire category list
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetTopBrandsBySubCategoryQuery,
  useLazyGetTopBrandsBySubCategoryQuery,
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateCategoryWithSubMutation,
  useDeleteUserMutation,
  useLazyGetCategoriesQuery,
  useToggleCategoryVisibilityMutation,
} = categoryApi;
