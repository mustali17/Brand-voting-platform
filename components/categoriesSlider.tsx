'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLazyGetCategoriesQuery } from '@/lib/services/category.service';
import { CategoryDetailsDto } from '@/utils/models/category.model';
import { useRouter } from 'next/navigation';

export function CategoriesSlider() {
  const [getAllCategories] = useLazyGetCategoriesQuery();
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [categoriesList, setCategoriesList] = useState(
    [] as CategoryDetailsDto[]
  );

  // Check if we need to show navigation arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    fetchCategories();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories().unwrap();
      setCategoriesList(response);
      console.log('Fetched categories:', response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200; // Adjust scroll amount as needed
    const currentScroll = scrollContainerRef.current.scrollLeft;

    scrollContainerRef.current.scrollTo({
      left:
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className='relative border-gray-300 py-1 max-w-2xl mx-auto mb-3'>
      {/* Left navigation button */}
      <button
        onClick={() => scroll('left')}
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 opacity-90 hover:opacity-100 transition-opacity',
          !showLeftArrow && 'hidden'
        )}
        aria-label='Scroll left'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      {/* Categories container */}
      <div
        ref={scrollContainerRef}
        className='flex space-x-4 overflow-x-auto scrollbar-hide pb-2 px-6'
        onClick={() => router.push('/category')}
      >
        {categoriesList.map((cat) => (
          <div
            key={cat._id}
            className='flex flex-col items-center flex-shrink-0 cursor-pointer'
          >
            <div className='rounded-full p-[2px] bg-gradient-to-tr from-white/50 to-black-600'>
              <div className='bg-white p-[2px] rounded-full'>
                <Image
                  src={cat.categoryImageURL || '/placeholder.svg'}
                  alt={`${cat.name}'s`}
                  width={36}
                  height={36}
                  className='rounded-full w-12 h-12 object-contain'
                />
              </div>
            </div>
            <span className='text-xs mt-1 truncate w-14 text-center'>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
      {/* See All Button with Border */}
      {categoriesList.length ? (
        <div className='absolute inset-x-0 bottom-0 flex justify-center items-center'>
          <div className='w-full border-t border-gray-300'></div>
          <button
            className='absolute bg-white px-4 py-1 text-sm font-small text-gray-700 rounded-full shadow-md hover:bg-gray-100 transition'
            onClick={() => router.push('/category')}
          >
            See All
          </button>
        </div>
      ) : (
        <></>
      )}

      {/* Right navigation button */}
      <button
        onClick={() => scroll('right')}
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 opacity-90 hover:opacity-100 transition-opacity',
          !showRightArrow && 'hidden'
        )}
        aria-label='Scroll right'
      >
        <ChevronRight className='h-5 w-5' />
      </button>
    </div>
  );
}
