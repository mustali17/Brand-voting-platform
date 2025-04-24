import { ProductDto, ProductFormDto } from '@/utils/models/product.model';
import { BRANDS, CREATE, PRODUCTS } from '../api/apiEndPoints';
import { api } from './api.service';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE: Add a new brand
    createProduct: builder.mutation<ProductFormDto, Partial<ProductFormDto>>({
      query: (newUser) => ({
        url: PRODUCTS + CREATE,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Product', 'Brand'],
    }),

    // UPDATE: Update a user
    updateProduct: builder.mutation<
      ProductDto,
      { id: string; data: Partial<ProductDto> }
    >({
      query: ({ id, data }) => ({
        url: `${PRODUCTS}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Brand' },
      ],
    }),
  }),
});

export const { useCreateProductMutation, useUpdateProductMutation } =
  productApi;
