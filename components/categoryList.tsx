'use client';
import {
  CategoryDetailsDto,
  CommonCategoryDto,
} from '@/utils/models/category.model';
import Image from 'next/image';
import Link from 'next/link';
import LoadingComponent from './LoadingComponent';

export default function CategoryList({
  categories,
  isLoading,
  isError,
  categoryClickHandler,
}: {
  categories: CommonCategoryDto[];
  isLoading: boolean;
  isError: boolean;
  categoryClickHandler?: (category: CategoryDetailsDto) => void;
}) {
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <div className='flex-1 p-4'>Error loading categories</div>;
  }

  return (
    <div className='flex-1 p-4'>
      <div className='grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'>
        {categories.map((category: any) => (
          <div
            key={category._id}
            onClick={() => {
              if (categoryClickHandler) {
                categoryClickHandler(category);
              }
            }}
            className='flex flex-col items-center cursor-pointer'
          >
            <div className='mb-2 rounded-full overflow-hidden bg-gray-100 p-1'>
              <Image
                src={category.imageUrl || '/placeholder.svg'}
                alt={category.name}
                width={80}
                height={80}
                className='h-16 w-16 rounded-full object-cover transition-transform hover:scale-110'
              />
            </div>
            <span className='text-center text-sm'>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
