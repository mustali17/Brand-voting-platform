'use client';
import {
  CategoryDetailsDto,
  CommonCategoryDto,
} from '@/utils/models/category.model';
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
            <div className='rounded-full w-16 h-16 bg-white ring-1 ring-gray-300 p-0.5 overflow-hidden flex items-center justify-center'>
              <img
                src={category.imageUrl || '/images/logo.jpeg'}
                alt={category.name}
                width={80}
                height={80}
                className='h-14 w-14 object-contain transition-transform hover:scale-110'
                onError={(e) => {
                  console.error('Image load error:', e);
                  console.error('Category Image:', category.imageUrl);
                }}
              />
            </div>
            <span className='text-center text-sm'>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
