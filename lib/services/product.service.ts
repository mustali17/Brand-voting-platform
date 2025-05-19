import { AdminDashboardDto } from './../../utils/models/product.model';
import {
  ProductDto,
  ProductFormDto,
  ProductListDto,
} from '@/utils/models/product.model';
import {
  ADMIN,
  BRANDS,
  CREATE,
  LIST,
  PRODUCTS,
  STATS,
  UNVOTE,
  VOTE,
} from '../api/apiEndPoints';
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
    getProductList: builder.query<
      ProductListDto,
      { page: number; search?: string }
    >({
      query: ({ page, search }) =>
        PRODUCTS +
        LIST +
        (search ? `?page=${1}&limit=${100}&search=${search}` : `?page=${page}`),
      providesTags: ['Product'],
    }),

    voteAProduct: builder.mutation<
      {
        success: boolean;
        votes: number;
      },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: PRODUCTS + VOTE,
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: [],
    }),
    unvoteAProduct: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: PRODUCTS + UNVOTE,
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: [],
    }),

    // Product List
    getAdminStats: builder.query<AdminDashboardDto, void>({
      query: () => ADMIN + STATS,
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useLazyGetProductListQuery,
  useVoteAProductMutation,
  useUnvoteAProductMutation,
  useGetAdminStatsQuery,
} = productApi;
