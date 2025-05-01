'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  name: string;
  img: string;
}

interface CategoriesSliderProps {
  Categories: Story[];
}

export function CategoriesSlider({ Categories }: CategoriesSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if we need to show navigation arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
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
    <div className='relative border-gray-300 py-1 max-w-2xl mx-auto'>
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
      >
        {Categories.map((story, i) => (
          <div key={i} className='flex flex-col items-center flex-shrink-0'>
            <div className='rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600'>
              <div className='bg-white p-[2px] rounded-full'>
                <Image
                  src={story.img || '/placeholder.svg'}
                  alt={`${story.name}'s story`}
                  width={36}
                  height={36}
                  className='rounded-full w-12 h-12 object-cover'
                />
              </div>
            </div>
            <span className='text-xs mt-1 truncate w-14 text-center'>
              {story.name}
            </span>
          </div>
        ))}
      </div>

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
