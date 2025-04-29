import {
  ProductDto,
  ProductFormDto,
  ProductListDto,
} from '@/utils/models/product.model';
import { BRANDS, CREATE, LIST, PRODUCTS } from '../api/apiEndPoints';
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

    // Product List
    getProductList: builder.query<ProductListDto, { page: number }>({
      query: ({ page }) => PRODUCTS + LIST + `?page=${page}`,
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useLazyGetProductListQuery,
} = productApi;
