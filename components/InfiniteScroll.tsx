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
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function InfiniteScroll() {
  //#region External Hooks
  const [fetchProductList, { isLoading, isError }] =
    useLazyGetProductListQuery();
  const [voteAProduct] = useVoteAProductMutation();
  const [unVoteAProduct] = useUnvoteAProductMutation();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  //#endregion

  //#region Internal Hooks
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [animatingItems, setAnimatingItems] = useState<Record<string, boolean>>(
    {}
  );
  const [likeAnimationPosition, setLikeAnimationPosition] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const observerRef = useRef<HTMLDivElement | null>(null);
  const lastTapTimeRef = useRef<Record<string, number>>({});
  const prevQueryRef = useRef(query);

  // Reset items when query changes
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
  //#endregion

  //#region Internal Function
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
    // Start animation if adding a vote
    if (addOrRemove === 'add') {
      setAnimatingItems((prev) => ({ ...prev, [productId]: true }));

      // Reset animation state after animation completes
      setTimeout(() => {
        setAnimatingItems((prev) => ({ ...prev, [productId]: false }));
      }, 800); // Match this with the CSS animation duration
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

    if (addOrRemove === 'remove') {
      try {
        await unVoteAProduct({ productId }).unwrap();
      } catch (error) {
        console.error('Error unvoting for product:', error);
      }
    } else {
      try {
        await voteAProduct({ productId }).unwrap();
      } catch (error) {
        console.error('Error voting for product:', error);
      }
    }
  };

  const handleDoubleTap = (event: React.MouseEvent, productId: string) => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[productId] || 0;
    const doubleTapDelay = 300; // ms

    // Set the position for the like animation
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (now - lastTap < doubleTapDelay) {
      // Double tap detected
      if (!items.find((item) => item._id === productId)?.hasVoted) {
        // Show animation at tap position
        setLikeAnimationPosition((prev) => ({
          ...prev,
          [productId]: { x, y },
        }));

        // Trigger like
        handleVote(productId, 'add');
      }
      // Reset last tap time
      lastTapTimeRef.current[productId] = 0;
    } else {
      // First tap
      lastTapTimeRef.current[productId] = now;

      // Clear first tap after delay
      setTimeout(() => {
        if (lastTapTimeRef.current[productId] === now) {
          lastTapTimeRef.current[productId] = 0;
        }
      }, doubleTapDelay);
    }
  };
  //#endregion

  return (
    <div className='max-w-xl mx-auto'>
      {items.map((item, index) => (
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
                <span className='text-gray-500 text-sm ml-2'>• {item._id}</span>
              </div>
            </div>
            <button className='ml-auto'>
              <MoreHorizontal className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          <div className='relative'>
            <Image
              alt='Post'
              src={item.imageUrl || '/images/post.jpg'}
              width={500}
              height={150}
              className='w-full object-cover rounded-lg h-[400px] cursor-pointer'
              onClick={(e) => handleDoubleTap(e, item._id)}
            />

            {/* Double tap heart animation */}
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

          {/* reaction */}
          <div className='flex justify-center mt-2 items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700'>
            <div
              className={`like-button-container ${animatingItems[item._id] ? 'animate-like' : ''}`}
            >
              {item.hasVoted ? (
                <ThumbsUp
                  fill='#000'
                  stroke='#777'
                  className={`w-4 h-4 cursor-pointer transition-all duration-300 ${animatingItems[item._id] ? 'linkedin-like-animation' : ''}`}
                  onClick={() => handleVote(item._id, 'remove')}
                />
              ) : (
                <ThumbsUp
                  className={`w-4 h-4 cursor-pointer hover:text-black-500 transition-all duration-300 ${animatingItems[item._id] ? 'linkedin-like-animation' : ''}`}
                  onClick={() => handleVote(item._id, 'add')}
                />
              )}
            </div>

            <span
              className={`text-sm font-medium transition-all duration-300 ${animatingItems[item._id] ? 'scale-110 font-bold' : ''}`}
            >
              {item.votes}
            </span>
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
      `}</style>
    </div>
  );
}
