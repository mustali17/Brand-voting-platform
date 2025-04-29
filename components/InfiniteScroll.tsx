'use client';

import { useLazyGetProductListQuery } from '@/lib/services/product.service';
import { Product } from '@/utils/models/product.model';
import { MoreHorizontal, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function InfiniteScroll() {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [fetchProductList, { isLoading, isError }] =
    useLazyGetProductListQuery();

  const fetchData = async (page: number) => {
    const products = await fetchProductList({ page }).unwrap();
    setItems((prev) => [...prev, ...products.products]);
    setHasMore(products.pagination.pages > page);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore]);

  return (
    <div className='p-4 max-w-xl mx-auto'>
      {items.map((item) => (
        <div className='border-b border-gray-300 pb-4' key={item._id}>
          {/* Post Header */}
          <div className='flex items-center p-3'>
            <div className='flex items-center'>
              <Image
                src={item.brandId.logoUrl || '/images/post.jpg'}
                alt='Profile'
                width={56}
                height={56}
                className='rounded-full w-8 h-8 mr-4'
              />

              <div className='flex items-center'>
                <span className='font-semibold text-sm'>
                  {item.brandId.name}
                </span>
                <span className='text-blue-500 ml-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-3 h-3'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
                <span className='text-gray-500 text-sm ml-2'>• 1h</span>
              </div>
            </div>
            <button className='ml-auto'>
              <MoreHorizontal className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          <div>
            <Image
              alt='Post'
              src={item.imageUrl || '/images/post.jpg'}
              width={500}
              height={150}
              className='w-full object-cover rounded-lg h-[400px]'
            />
          </div>
          {/* reaction */}
          <div className='flex justify-center mt-2  items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700'>
            <ThumbsUp className='w-4 h-4 cursor-pointer hover:text-blue-500' />
            <span className='text-sm font-medium'>{item.votes}</span>
          </div>
        </div>
      ))}

      {hasMore && (
        <div
          ref={observerRef}
          className='h-10 flex justify-center items-center text-gray-500'
        >
          Loading...
        </div>
      )}
    </div>
  );
}
