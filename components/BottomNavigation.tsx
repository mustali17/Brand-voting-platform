'use client';
import { Home, Search, Compass, Bell, UserCircle2Icon } from 'lucide-react';
import React, { useState } from 'react';
import SearchOverlay from './searchOverkay';
import Link from 'next/link';

const BottomNavigation = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <div className='md:hidden border-t border-gray-300 py-2 bg-white fixed bottom-0 left-0 right-0'>
        <div className='flex justify-around'>
          <Link href={'/'}>
            <button className='p-2'>
              <Home className='h-6 w-6' />
            </button>
          </Link>
          <button className='p-2'>
            <Search className='h-6 w-6' onClick={() => setIsSearchOpen(true)} />
          </button>
          <Link href={'/notifications'}>
            <button className='p-2 relative'>
              <Bell className='h-6 w-6' />
              {/* <span className='absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
              8
              </span> */}
            </button>
          </Link>
          <Link href={'/profile'}>
            <button className='p-2'>
              <UserCircle2Icon className='h-6 w-6' />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
