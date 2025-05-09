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
  //#region External Hooks
  const [fetchProductList] = useLazyGetProductListQuery();
  const [voteAProduct] = useVoteAProductMutation();
  const [unVoteAProduct] = useUnvoteAProductMutation();
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || '';
  const router = useRouter();
  //#endregion

  //#region Internal Hooks
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [animatingItems, setAnimatingItems] = useState<Record<string, boolean>>(
    {}
  );
  const [likeAnimationPosition, setLikeAnimationPosition] = useState<
    Record<string, boolean>
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
  //#endregion

  //#region Internal Functions
  const fetchData = async (page: number, search?: string) => {
    setIsLoadingProducts(true);
    const products = await fetchProductList({ page, search }).unwrap();
    if (search || page === 1) {
      setItems(products.products);
    } else {
      setItems((prev) => [...prev, ...products.products]);
    }
    setHasMore(products.pagination.pages > page);
    setIsLoadingProducts(false);
  };

  const handleVote = async (
    productId: string,
    addOrRemove: 'add' | 'remove'
  ) => {
    if (addOrRemove === 'add') {
      setAnimatingItems((prev) => ({ ...prev, [productId]: true }));
      setLikeAnimationPosition((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAnimatingItems((prev) => ({ ...prev, [productId]: false }));
        setLikeAnimationPosition((prev) => ({ ...prev, [productId]: false }));
      }, 1000);
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

    if (now - lastTap < doubleTapDelay) {
      if (!items.find((item) => item._id === productId)?.hasVoted) {
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
  //#endregion

  //#region UI Component
  if (isLoadingProducts) {
    return (
      <div className='flex justify-center py-8 text-black/50'>
        Loading products...
      </div>
    );
  } else if (!isLoadingProducts && query && items.length === 0) {
    return (
      <div className='flex justify-center py-8 text-black/50'>
        No products found.
      </div>
    );
  }
  //#endregion

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
                className='w-full max-w-full object-contain h-[400px] cursor-pointer'
                onClick={(e) => handleDoubleTap(e, item._id)}
              />

              {likeAnimationPosition[item._id] && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none heart-animation'>
                  <ThumbsUp
                    className='instagram-heart'
                    fill='#fff'
                    stroke='#777'
                    size={64}
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
              <div className={`like-button-container`}>
                {item.hasVoted ? (
                  <ThumbsUp
                    fill='#000'
                    stroke='#777'
                    className={`w-4 h-4 cursor-pointer transition-all duration-300`}
                    onClick={() => handleVote(item._id, 'remove')}
                  />
                ) : (
                  <ThumbsUp
                    className={`w-4 h-4 cursor-pointer hover:text-black-500 transition-all duration-300`}
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
        .heart-animation {
          animation: instagramHeart 1s ease-in-out forwards;
          transform-origin: center;
        }
        @keyframes instagramHeart {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          15% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          30% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          45% {
            transform: scale(1);
            opacity: 1;
          }
          80% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .instagram-heart {
          filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
          fill: white;
          stroke: rgba(0, 0, 0, 0.3);
          stroke-width: 1;
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
