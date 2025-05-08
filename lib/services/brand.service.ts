import { DELETE } from './../../app/api/user/[id]/route';
import {
  BrandDetailsDto,
  BrandDto,
  BrandFormDto,
  SuggestedBrandDto,
} from '@/utils/models/brand.model';
import {
  BRANDS,
  FOLLOW,
  REGISTER,
  SUGGESTED,
  UNFOLLOW,
} from '../api/apiEndPoints';
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

    // UPDATE: Update a brand
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

    getSuggestedBrands: builder.query<
      { success: boolean; suggestedBrands: SuggestedBrandDto[]; error: string },
      void
    >({
      query: (id) => `${BRANDS}/${SUGGESTED}`,
      providesTags: (result, error) => [{ type: 'Brand' }],
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
  useGetSuggestedBrandsQuery,
  useLazyGetSuggestedBrandsQuery,
} = brandApi;
