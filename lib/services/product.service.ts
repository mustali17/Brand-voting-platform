import { ProductDto, ProductFormDto } from "@/utils/models/product.model";
import { createApi } from "@reduxjs/toolkit/query/react";
import { BRANDS, CREATE, PRODUCTS, REGISTER } from "../api/apiEndPoints";
import { baseQuery } from "../api/baseQuery";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // READ: Get all users
    getUsers: builder.query<ProductFormDto[], void>({
      query: () => BRANDS,
      providesTags: ["Product"],
    }),

    // READ: Get single user
    getUserById: builder.query<ProductFormDto, number>({
      query: (id) => `${BRANDS}/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // CREATE: Add a new brand
    createProduct: builder.mutation<ProductFormDto, Partial<ProductFormDto>>({
      query: (newUser) => ({
        url: PRODUCTS + CREATE,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Product"],
    }),

    // UPDATE: Update a user
    updateProduct: builder.mutation<
      ProductDto,
      { id: string; data: Partial<ProductDto> }
    >({
      query: ({ id, data }) => ({
        url: `${PRODUCTS}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // DELETE: Delete a user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${BRANDS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteUserMutation,
} = productApi;
