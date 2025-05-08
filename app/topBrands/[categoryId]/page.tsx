'use client';

import Image from 'next/image';
import { useGetTopBrandsBySubCategoryQuery } from '@/lib/services/category.service';
import { useRouter } from 'next/navigation';

export default function BrandShowcase({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = params;
  const { data, isLoading, isError } =
    useGetTopBrandsBySubCategoryQuery(categoryId);
  const router = useRouter();
  if (isLoading) {
    return <div className='flex justify-center py-8'>Loading brands...</div>;
  }

  if (isError || !data) {
    return (
      <div className='flex justify-center py-8 text-red-500'>
        Something went wrong.
      </div>
    );
  }

  return (
    <section className='p-10 container justify-center items-center'>
      <div className='container mx-auto max-w-7xl text-center mb-12 justify-center items-center'>
        <h1 className='text-4xl font-bold mb-2'>Brand Showcase</h1>
        <p className='text-gray-600 text-lg'>
          Discover the top brands across various categories
        </p>
      </div>

      <div className='container mx-auto max-w-4xl space-y-6'>
        <h2 className='text-2xl font-semibold mb-4'>Top Brands</h2>

        {data.brands.length ? (
          data.brands.map((brand, index) => (
            <article
              key={brand._id}
              onClick={() => router.push(`/profile/brands/${brand._id}`)}
              className='flex flex-col md:flex-row border rounded-lg overflow-hidden cursor-pointer shadow-sm bg-white hover:shadow-md hover:scale-[1.02] transition-transform duration-200'
            >
              <div className='md:w-1/4 bg-gray-100 flex items-center justify-center p-6'>
                <Image
                  src={brand.logoUrl || '/placeholder.svg'}
                  alt={`${brand.name} logo`}
                  width={100}
                  height={100}
                  className='object-contain'
                />
              </div>

              <div className='relative md:w-3/4 p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold'>{brand.name}</h3>
                    <span className='text-gray-500 text-sm'>#{index + 1}</span>
                  </div>
                  <span className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                    Followers: {brand.followerCount}
                  </span>
                </div>

                <p className='text-gray-700 text-sm mt-3'>
                  {brand.description || 'Brand description goes here.'}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className='flex justify-center py-8 text-gray-500'>
            No brands found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
