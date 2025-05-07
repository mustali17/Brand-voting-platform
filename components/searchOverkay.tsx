'use client';

import type React from 'react';

import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 text-black/80 bg-white z-50 flex flex-col overflow-y-auto'>
      <div className='p-4 sm:p-6 max-w-3xl mx-auto w-full'>
        <div className='flex justify-end mb-4'>
          <button
            onClick={onClose}
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

        <div className='text-black/70 text-sm font-medium mb-2'>
          QUICK LINKS
        </div>

        <div className='grid gap-2'>
          {[
            'Explore',
            'Notifications',
            'Profile',
            'Saved Posts',
            'Settings',
          ].map((item) => (
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
