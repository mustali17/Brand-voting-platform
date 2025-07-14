'use client';

import type React from 'react';

import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyGetProductListQuery } from '@/lib/services/product.service';
import { Brand } from '@/utils/models/brand.model';
import { useDebounceCallback } from '@/lib/hook/useDebounceCallback';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [brandSuggestionList, setBrandSuggestionList] = useState<Brand[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [triggerSearch, { data: brandList }] = useLazyGetProductListQuery();

  // Focus the input when the overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Here you would typically navigate to search results
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const fetchBrandSuggestions = useCallback(async () => {
    if (searchQuery.trim()) {
      const { data } = await triggerSearch({ page: 1, search: searchQuery });
      if (data && data.type === 'brand') {
        const suggestions = data.brands;
        setBrandSuggestionList(suggestions);
      } else {
        setBrandSuggestionList([]);
      }
    } else {
      setBrandSuggestionList([]);
    }
  }, [searchQuery, triggerSearch]);

  // Debounced version of the function
  const debouncedFetch = useDebounceCallback(fetchBrandSuggestions, 300);

  // Run debounced function on searchQuery change
  useEffect(() => {
    debouncedFetch(searchQuery);
  }, [searchQuery, debouncedFetch]);

  console.log('Brand Suggestions:', brandSuggestionList);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 text-black/80 bg-white z-50 flex flex-col overflow-y-auto'>
      <div className='p-4 sm:p-6 max-w-3xl mx-auto w-full'>
        <div className='flex justify-end mb-4'>
          <button
            onClick={() => {
              router.push(`/`);
              onClose();
            }}
            className='text-black hover:bg-black/10 p-2 rounded-full transition-colors'
            aria-label='Close search'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <form onSubmit={handleSearch} className='mb-8'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              ref={inputRef}
              type='search'
              className='block w-full p-4 pl-10 text-lg bg-white border-0 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='Type a command or search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div
          className={`transition-all duration-500 ease-out ${
            brandSuggestionList.length > 0
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className='text-black/70 text-sm font-medium mb-2'>Brands</div>
          <div className='grid gap-2'>
            {brandSuggestionList.map((item) => (
              <button
                key={item._id}
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-black/10 text-black text-left transition-colors'
                onClick={() => {
                  router.push(`/profile/brands/${item._id}`);
                  onClose();
                }}
              >
                <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                  <Search className='h-4 w-4' />
                </div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='text-black/70 text-sm font-medium my-2'>
          QUICK LINKS
        </div>

        <div className='grid gap-2'>
          {['Notifications', 'Profile'].map((item) => (
            <button
              key={item}
              className='flex items-center gap-3 p-3 rounded-lg hover:bg-black/10 text-black text-left transition-colors'
              onClick={() => {
                router.push(`/${item.toLowerCase().replace(' ', '-')}`);
                onClose();
              }}
            >
              <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                <Search className='h-4 w-4' />
              </div>
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
