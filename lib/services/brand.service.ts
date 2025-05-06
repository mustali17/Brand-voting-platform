import { DELETE } from './../../app/api/user/[id]/route';
import {
  BrandDetailsDto,
  BrandDto,
  BrandFormDto,
} from '@/utils/models/brand.model';
import { BRANDS, FOLLOW, REGISTER, UNFOLLOW } from '../api/apiEndPoints';
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
    createBrand: builder.mutation<
      { success: boolean; brand: BrandDto },
      Partial<BrandFormDto>
    >({
      query: (newUser) => ({
        url: BRANDS + REGISTER,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Brand'],
    }),

    // UPDATE: Update a user
    updateBrand: builder.mutation<
      { success: boolean; brand: BrandDto },
      { id: string; data: Partial<BrandDto> }
    >({
      query: ({ id, data }) => ({
        url: `${BRANDS}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }],
    }),

    // Follow a brand
    followBrand: builder.mutation<
      boolean,
      {
        brandId: string;
      }
    >({
      query: (brandId) => ({
        url: BRANDS + FOLLOW,
        method: 'POST',
        body: brandId,
      }),
      invalidatesTags: ['Brand'],
    }),
    // UnFollow a brand
    unFollowBrand: builder.mutation<
      boolean,
      {
        brandId: string;
      }
    >({
      query: (brandId) => ({
        url: BRANDS + FOLLOW,
        method: 'DELETE',
        body: brandId,
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandByIdQuery,
  useLazyGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useFollowBrandMutation,
  useUnFollowBrandMutation,
} = brandApi;
