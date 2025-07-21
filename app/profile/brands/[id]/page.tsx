'use client';

import {
  useFollowBrandMutation,
  useGetBrandByIdQuery,
  useUnFollowBrandMutation,
} from '@/lib/services/brand.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Post from '../../products';
import { useCallback, useEffect, useState } from 'react';
import BrandForm from './brandForm';
import ProductForm from './productForm';
import Products from '../../products';
import { ProductDto } from '@/utils/models/product.model';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { userAgentFromString } from 'next/server';
import toast from 'react-hot-toast';
import { updateUser } from '@/lib/features/user/userSlice';
import { RootState } from '@/lib/store';
import LoadingComponent from '@/components/LoadingComponent';

interface State {
  isEdit: boolean;
  isAddProduct: boolean;
  modifyProduct: ProductDto;
  isSubmitting: boolean;
}
const initialState: State = {
  isEdit: false,
  isAddProduct: false,
  modifyProduct: {} as ProductDto,
  isSubmitting: false,
};
export default function Brand({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: brand, isLoading, error } = useGetBrandByIdQuery(id);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const isOwner = brand?.brand?.ownerId === user?._id;

  const [followBrand] = useFollowBrandMutation();
  const [unFollowBrand] = useUnFollowBrandMutation();
  //#region Internal Hooks
  const [brandScreenStates, setBrandScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setBrandScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );
  //#endregion

  //#region UI Component
  if (isLoading) return <LoadingComponent />;
  if (error || !brand || !user)
    return <div className='flex justify-center p-8'>Something went wrong.</div>;
  //#endregion

  const handleFollow = async (follow: boolean) => {
    if (isOwner) return;
    updateState({ isSubmitting: true });
    if (user.following?.includes(brand.brand._id)) {
      try {
        await unFollowBrand({ brandId: brand.brand._id }).unwrap();
        dispatch(
          updateUser({
            following: user.following.filter(
              (id: string) => id !== brand.brand._id
            ),
          })
        );
        toast.success('Unfollowed successfully');
      } catch (error) {
        toast.error('Failed to unfollow brand');
      }
    } else {
      try {
        await followBrand({ brandId: brand.brand._id }).unwrap();
        dispatch(
          updateUser({
            following: [...user.following, brand.brand._id],
          })
        );
        toast.success('Followed successfully');
      } catch (error) {
        toast.error('Failed to follow brand');
      }
    }
    updateState({ isSubmitting: false });
  };

  return (
    <div
      className={`mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mt-5 min-h-screen overflow-hidden relative shadow-none outline-0 border-0
      ${
        brandScreenStates.isEdit || brandScreenStates.isAddProduct
          ? 'w-full sm:flex-1 lg:max-w-2xl'
          : 'w-full'
      }
      `}
    >
      {brandScreenStates.isEdit ? (
        <BrandForm
          callBack={() => updateState({ isEdit: false })}
          brandData={brand.brand}
        />
      ) : brandScreenStates.isAddProduct ? (
        <ProductForm
          callBack={() => {
            updateState({
              isAddProduct: false,
              modifyProduct: {} as ProductDto,
            });
          }}
          brandId={brand.brand._id}
          modifyProduct={brandScreenStates.modifyProduct}
        />
      ) : (
        <>
          <div className='absolute top-4 left-4 cursor-pointer'>
            <ArrowLeft onClick={() => router.back()} />
          </div>
          <CardHeader className='flex flex-col items-center space-y-4 md:col-span-1'>
            <div className='h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center'>
              {/* Placeholder for brand logo */}
              <div className='h-22 w-22 rounded-full overflow-hidden'>
                <Image
                  src={brand.brand.logoUrl}
                  alt={`${brand.brand.name} logo`}
                  width={80}
                  height={80}
                  className='object-cover'
                />
              </div>
            </div>
            <h1 className='text-2xl font-bold'>{brand.brand.name}</h1>

            <div className='flex w-full justify-center gap-8 text-center'>
              <div>
                {/* <p className='font-semibold'>{brand.brand.followers}</p> */}
                <p className='font-semibold'>
                  {brand.brand.followers.length || 0}
                </p>
                <p className='text-sm text-muted-foreground'>Followers</p>
              </div>
              <div>
                <p className='font-semibold'>{brand.products.length}</p>
                <p className='text-sm text-muted-foreground'>Posts</p>
              </div>
            </div>
            {isOwner ? (
              <>
                <Button
                  className='w-full'
                  title='Edit'
                  onClick={() => updateState({ isEdit: true })}
                />
                <Button
                  className='w-full'
                  title='Add Product'
                  onClick={() => updateState({ isAddProduct: true })}
                />
              </>
            ) : (
              <Button
                className='w-full'
                title={
                  user.following?.includes(brand.brand._id)
                    ? 'Unfollow'
                    : 'Follow'
                }
                onClick={() =>
                  handleFollow(user.following?.includes(brand.brand._id))
                }
                isLoading={brandScreenStates.isSubmitting}
              />
            )}
          </CardHeader>

          <CardContent className='space-y-4 md:col-span-2 w-full p-0'>
            <Tabs defaultValue='description'>
              <TabsList className='w-full'>
                <TabsTrigger value='description' className='flex-1'>
                  Description
                </TabsTrigger>
                <TabsTrigger value='products' className='flex-1'>
                  Products
                </TabsTrigger>
              </TabsList>

              <div className='overflow-auto max-h-[400px]'>
                <TabsContent value='description' className='space-y-4 pt-4'>
                  <p className='text-sm'>{brand.brand.description}</p>

                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-semibold'>Joined:</span>{' '}
                      {new Date(brand.brand.createdAt || '').toLocaleString()}
                    </p>

                    {brand?.brand?.website && (
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold'>Website:</span>
                        <Link
                          href={brand?.brand?.website}
                          className='text-sm text-primary flex items-center gap-1 hover:underline'
                          target='_blank'
                        >
                          {brand?.brand?.website?.replace('https://', '')}
                          <ExternalLink className='h-3 w-3' />
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='products' className='pt-4'>
                  <Products
                    products={brand.products}
                    updateProduct={(product) => {
                      if (isOwner) {
                        updateState({
                          isAddProduct: true,
                          modifyProduct: product,
                        });
                      } else {
                        router.push(`/?search=${product.name}`);
                      }
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </>
      )}
    </div>
  );
}
