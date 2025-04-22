"use client";

import { useGetBrandByIdQuery } from "@/lib/services/brand.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Post from "../../products";
import { useCallback, useEffect, useState } from "react";
import BrandForm from "./brandForm";
import ProductForm from "./productForm";
import Products from "../../products";
import { ProductDto } from "@/utils/models/product.model";

interface State {
  isEdit: boolean;
  isAddProduct: boolean;
  modifyProduct:ProductDto
}
const initialState: State = {
  isEdit: false,
  isAddProduct: false,
  modifyProduct:{} as ProductDto
};
export default function Brand({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: brand, isLoading, error } = useGetBrandByIdQuery(id);

  //#region Internal Hooks
  const [brandScreenStates, setBrandScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setBrandScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );
  //#endregion

  //#region UI Component
  if (isLoading)
    return <div className='flex justify-center p-8'>Loading brand...</div>;
  if (error || !brand)
    return <div className='flex justify-center p-8'>Something went wrong.</div>;
  //#endregion

  return (
    <Card className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mt-5 ma-h-72 overflow-hidden'>
      {brandScreenStates.isEdit ? (
        <BrandForm
          callBack={() => updateState({ isEdit: false })}
          brandData={brand.brand}
        />
      ) : brandScreenStates.isAddProduct ? (
        <ProductForm
          callBack={() => updateState({ isAddProduct: false })}
          brandId={brand.brand._id}
          modifyProduct={brandScreenStates.modifyProduct}
        />
      ) : (
        <>
          <CardHeader className='flex flex-col items-center space-y-4 md:col-span-1'>
            <div className='h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center'>
              {/* Placeholder for brand logo */}
              <div className='h-20 w-20 rounded-full overflow-hidden'>
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
                <p className='font-semibold'>{0}</p>
                <p className='text-sm text-muted-foreground'>Followers</p>
              </div>
              <div>
                {/* <p className='font-semibold'>{brand.brand.posts}</p> */}
                <p className='font-semibold'>{0}</p>
                <p className='text-sm text-muted-foreground'>Posts</p>
              </div>
            </div>

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
          </CardHeader>

          <CardContent className='space-y-4 md:col-span-2'>
            <Tabs defaultValue='description'>
              <TabsList className='w-full'>
                <TabsTrigger value='description' className='flex-1'>
                  Description
                </TabsTrigger>
                <TabsTrigger value='posts' className='flex-1'>
                  Posts
                </TabsTrigger>
              </TabsList>

              <div className='overflow-auto max-h-[400px]'>
                <TabsContent value='description' className='space-y-4 pt-4'>
                  <p className='text-sm'>{brand.brand.description}</p>

                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-semibold'>Joined:</span>{" "}
                      {/* {brand.brand.joinedDate} */}0
                    </p>

                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold'>Website:</span>
                      <Link
                        href={brand?.brand?.website}
                        className='text-sm text-primary flex items-center gap-1 hover:underline'
                        target='_blank'
                      >
                        {brand?.brand?.website?.replace("https://", "")}
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='posts' className='pt-4'>
                  <Products products={brand.products} updateProduct={(product)=> {updateState({isAddProduct:true,modifyProduct:product})}} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </>
      )}
    </Card>
  );
}
