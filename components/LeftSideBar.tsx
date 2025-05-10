'use client';
import {
  Home,
  Compass,
  SearchIcon,
  Bell,
  UserCircle2Icon,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import SearchOverlay from './searchOverkay';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

const LeftSideBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Left Sidebar */}
      <div className='w-60 border-r border-gray-300 hidden md:flex flex-col'>
        <nav className='flex-1'>
          <div className='space-y-1 px-3'>
            <Link
              href='/'
              className='flex items-center px-3 py-3 text-xl my-4 italic font-medium rounded-md hover:bg-gray-100'
            >
              Brand Voting
            </Link>
            <Link
              href='/'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Home className='mr-3 h-5 w-5' />
              Home
            </Link>

            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
              onClick={() => setIsSearchOpen(true)}
            >
              <SearchIcon className='mr-3 h-5 w-5' />
              Search
            </Link>

            <Link
              href='/notifications'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Bell className='mr-3 h-5 w-5' />
              Notifications
            </Link>

            <Link
              href='/profile'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <UserCircle2Icon className='mr-3 h-5 w-5' />
              Profile
            </Link>

            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100 text-red-400'
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className='mr-3 h-5 w-5 ' />
              Logout
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default LeftSideBar;
