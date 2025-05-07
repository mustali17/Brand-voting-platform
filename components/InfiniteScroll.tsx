'use client';

import type React from 'react';
import {
  useLazyGetProductListQuery,
  useUnvoteAProductMutation,
  useVoteAProductMutation,
} from '@/lib/services/product.service';
import type { Product } from '@/utils/models/product.model';
import { MoreHorizontal, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function InfiniteScroll() {
  const [fetchProductList, { isLoading, isError }] =
    useLazyGetProductListQuery();
  const [voteAProduct] = useVoteAProductMutation();
  const [unVoteAProduct] = useUnvoteAProductMutation();
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || '';
  const router = useRouter();

  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [animatingItems, setAnimatingItems] = useState<Record<string, boolean>>(
    {}
  );
  const [likeAnimationPosition, setLikeAnimationPosition] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const observerRef = useRef<HTMLDivElement | null>(null);
  const lastTapTimeRef = useRef<Record<string, number>>({});
  const prevQueryRef = useRef(query);

  useEffect(() => {
    if (prevQueryRef.current !== query) {
      setItems([]);
      setPage(1);
      prevQueryRef.current = query;
    }
  }, [query]);

  useEffect(() => {
    fetchData(page, query);
  }, [page, query]);

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

  const fetchData = async (page: number, search?: string) => {
    const products = await fetchProductList({ page, search }).unwrap();
    if (search || page === 1) {
      setItems(products.products);
    } else {
      setItems((prev) => [...prev, ...products.products]);
    }
    setHasMore(products.pagination.pages > page);
  };

  const handleVote = async (
    productId: string,
    addOrRemove: 'add' | 'remove'
  ) => {
    if (addOrRemove === 'add') {
      setAnimatingItems((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAnimatingItems((prev) => ({ ...prev, [productId]: false }));
      }, 800);
    }

    const updatedItems = items.map((item) =>
      item._id === productId
        ? {
            ...item,
            hasVoted: !item.hasVoted,
            votes: addOrRemove === 'add' ? item.votes + 1 : item.votes - 1,
          }
        : item
    );
    setItems(updatedItems);

    try {
      addOrRemove === 'add'
        ? await voteAProduct({ productId }).unwrap()
        : await unVoteAProduct({ productId }).unwrap();
    } catch (error) {
      console.error(
        `Error ${addOrRemove === 'add' ? 'voting' : 'unvoting'}:`,
        error
      );
    }
  };

  const handleDoubleTap = (event: React.MouseEvent, productId: string) => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[productId] || 0;
    const doubleTapDelay = 300;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (now - lastTap < doubleTapDelay) {
      if (!items.find((item) => item._id === productId)?.hasVoted) {
        setLikeAnimationPosition((prev) => ({
          ...prev,
          [productId]: { x, y },
        }));
        handleVote(productId, 'add');
      }
      lastTapTimeRef.current[productId] = 0;
    } else {
      lastTapTimeRef.current[productId] = now;
      setTimeout(() => {
        if (lastTapTimeRef.current[productId] === now) {
          lastTapTimeRef.current[productId] = 0;
        }
      }, doubleTapDelay);
    }
  };

  const toggleDescription = (productId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className='max-w-xl mx-auto'>
      {items.map((item) => {
        const isExpanded = expandedDescriptions[item._id];

        return (
          <div className='border-b border-gray-300 pb-4' key={item._id}>
            <div className='flex items-center p-3'>
              <div className='flex items-center'>
                <Image
                  src={item.brandId.logoUrl || '/images/post.jpg'}
                  alt='Profile'
                  width={56}
                  height={56}
                  className='rounded-full w-8 h-8 mr-4 cursor-pointer'
                  onClick={() =>
                    router.push(`profile/brands/${item.brandId._id}`)
                  }
                />
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <span className='font-semibold text-sm'>{item.name}</span>
                  </div>
                  <div className='text-xs text-gray-500'>
                    {item.category} • {item.subcategory.join(', ')}
                  </div>
                </div>
              </div>
              <button className='ml-auto'>
                <MoreHorizontal className='h-5 w-5 text-gray-500' />
              </button>
            </div>

            <div className='relative group rounded-lg overflow-hidden'>
              <Image
                alt='Post'
                src={item.imageUrl || '/images/post.jpg'}
                width={500}
                height={400}
                className='w-full object-cover h-[400px] cursor-pointer'
                onClick={(e) => handleDoubleTap(e, item._id)}
              />
              {likeAnimationPosition[item._id] && (
                <div
                  className='absolute pointer-events-none heart-animation'
                  style={{
                    left: `${likeAnimationPosition[item._id].x}px`,
                    top: `${likeAnimationPosition[item._id].y}px`,
                  }}
                >
                  <ThumbsUp
                    fill='white'
                    stroke='black'
                    className='w-24 h-24 opacity-0'
                  />
                </div>
              )}
            </div>
            <div className='bg-white/70 text-gray-500 p-3 text-sm'>
              <div className='w-full'>
                <p
                  className={`text-sm transition-all duration-300 ${
                    !isExpanded ? 'line-clamp-2' : ''
                  }`}
                >
                  {item.description}
                  {item.description}
                  {item.description}
                </p>
                {item.description.length > 100 && (
                  <button
                    className='text-xs mt-1 text-blue-500 underline'
                    onClick={() => toggleDescription(item._id)}
                  >
                    {isExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </div>
            <div className='flex justify-center mt-2 items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700'>
              <div
                className={`like-button-container ${
                  animatingItems[item._id] ? 'animate-like' : ''
                }`}
              >
                {item.hasVoted ? (
                  <ThumbsUp
                    fill='#000'
                    stroke='#777'
                    className={`w-4 h-4 cursor-pointer transition-all duration-300 ${
                      animatingItems[item._id] ? 'linkedin-like-animation' : ''
                    }`}
                    onClick={() => handleVote(item._id, 'remove')}
                  />
                ) : (
                  <ThumbsUp
                    className={`w-4 h-4 cursor-pointer hover:text-black-500 transition-all duration-300 ${
                      animatingItems[item._id] ? 'linkedin-like-animation' : ''
                    }`}
                    onClick={() => handleVote(item._id, 'add')}
                  />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  animatingItems[item._id] ? 'scale-110 font-bold' : ''
                }`}
              >
                {item.votes}
              </span>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div
          ref={observerRef}
          className='h-10 flex justify-center items-center text-gray-500'
        >
          Loading...
        </div>
      )}

      <style jsx global>{`
        .linkedin-like-animation {
          animation: linkedinLike 0.8s ease-in-out;
        }
        @keyframes linkedinLike {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.5);
          }
          50% {
            transform: scale(0.8);
          }
          75% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .heart-animation {
          animation: heartBeat 1s ease-in-out forwards;
          transform-origin: center;
        }
        @keyframes heartBeat {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          15% {
            transform: scale(1.3);
            opacity: 1;
          }
          30% {
            transform: scale(0.9);
            opacity: 1;
          }
          45% {
            transform: scale(1.2);
            opacity: 1;
          }
          60% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
