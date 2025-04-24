import {
  BrandDetailsDto,
  BrandDto,
  BrandFormDto,
} from '@/utils/models/brand.model';
import { BRANDS, REGISTER } from '../api/apiEndPoints';
import { api } from './api.service';

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // READ: Get single user
    getBrandById: builder.query<BrandDetailsDto, string>({
      query: (id) => `${BRANDS}/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Brand', id },
        { type: 'Product' },
      ],
    }),

    // CREATE: Add a new brand
    createBrand: builder.mutation<BrandFormDto, Partial<BrandFormDto>>({
      query: (newUser) => ({
        url: BRANDS + REGISTER,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Brand'],
    }),

    // UPDATE: Update a user
    updateBrand: builder.mutation<
      BrandDto,
      { id: string; data: Partial<BrandDto> }
    >({
      query: ({ id, data }) => ({
        url: `${BRANDS}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }],
    }),
  }),
});

export const {
  useGetBrandByIdQuery,
  useLazyGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
