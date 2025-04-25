'use client';

import { useEffect, useRef, useState } from 'react';

type Item = {
  id: number;
  name: string;
};

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (page: number) => {
    const res = await fetch(`/api/items?page=${page}`);
    const result = await res.json();
    setItems((prev) => [...prev, ...result.data]);
    setHasMore(result.hasMore);
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
        <div key={item.id} className='border p-2 mb-2 rounded shadow'>
          {item.name}
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
