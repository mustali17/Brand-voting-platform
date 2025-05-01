'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import SearchOverlay from '@/components/searchOverkay';
import {
  Bell,
  Compass,
  Home,
  LogOut,
  MoreHorizontal,
  Search,
  SearchIcon,
  ThumbsDown,
  ThumbsUp,
  UserCircle2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const route = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className='flex h-screen bg-white'>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Left Sidebar */}
      <div className='w-60 border-r border-gray-300 hidden md:flex flex-col'>
        <nav className='flex-1'>
          <div className='space-y-1 px-3'>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Home className='mr-3 h-5 w-5' />
              Home
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Compass className='mr-3 h-5 w-5' />
              Explore
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
              href='#'
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
            >
              <LogOut className='mr-3 h-5 w-5 ' />
              Logout
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile Header */}

        <div className='flex-1 overflow-y-auto'>
          {/* Stories */}
          <div className='border-b border-gray-300 py-4 px-4'>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {[
                { name: 'zaincontra...', img: '/images/post.jpg' },
                { name: 'hakimkap...', img: '/images/story.jpg' },
                { name: 'hisukriti', img: '/images/story.jpg' },
                { name: 'bhuvan.ba...', img: '/images/story.jpg' },
                { name: 'mipalkarof...', img: '/images/story.jpg' },
                { name: 'naughtyw...', img: '/images/story.jpg' },
                { name: 'thehungry...', img: '/images/story.jpg' },
              ].map((story, i) => (
                <div key={i} className='flex flex-col items-center'>
                  <Image
                    src='/images/post.jpg'
                    alt='Profile'
                    width={56}
                    height={56}
                    className='rounded-full w-14 h-14 mr-4'
                  />

                  <span className='text-xs mt-1 truncate w-16 text-center'>
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div className='max-w-xl mx-auto w-full'>
            {/* Post */}
            <InfiniteScroll />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden border-t border-gray-300 py-2 bg-white fixed bottom-0 left-0 right-0'>
          <div className='flex justify-around'>
            <button className='p-2'>
              <Home className='h-6 w-6' />
            </button>
            <button className='p-2'>
              <Search
                className='h-6 w-6'
                onClick={() => setIsSearchOpen(true)}
              />
            </button>
            <button className='p-2'>
              <Compass className='h-6 w-6' />
            </button>
            <button className='p-2 relative'>
              <Bell className='h-6 w-6' />
              <span className='absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                8
              </span>
            </button>
            <button className='p-2' onClick={() => route.push('/profile')}>
              <UserCircle2Icon className='h-6 w-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Suggestions */}
      <div className='w-80 border-l border-gray-300 p-4 hidden lg:block'>
        <div
          className='flex items-center mb-6 cursor-pointer'
          onClick={() => route.push('/profile')}
        >
          <Image
            src='/images/post.jpg'
            alt='Profile'
            width={56}
            height={56}
            className='rounded-full w-14 h-14 mr-4'
          />
          <div>
            <div className='font-semibold'>mr.mohammad_02</div>
            <div className='text-gray-500 text-sm'>محمد</div>
          </div>
        </div>

        <div className='flex justify-between items-center mb-4'>
          <span className='text-gray-500 font-semibold'>Suggested for you</span>
          <button className='text-sm font-semibold'>See All</button>
        </div>

        {[
          { name: 'tasneem28', followedBy: 'mubaranapur', time: '16' },
          { name: 'jamilazuzerbhai', followedBy: 'burhan72002', time: '5' },
          { name: 'taher_8_', followedBy: 'm_o_h_a_m_m_e_d', time: '' },
          { name: 'kayda_husain', followedBy: 'shubham_pathak_', time: '' },
          { name: 'ali_k_hasam', followedBy: 'chuna.huzefa', time: '12' },
        ].map((suggestion, i) => (
          <div key={i} className='flex items-center mb-3'>
            <Image
              src='/images/post.jpg'
              alt={suggestion.name}
              width={44}
              height={44}
              className='rounded-full w-11 h-11 mr-3'
            />
            <div className='flex-1'>
              <div className='font-semibold text-sm'>{suggestion.name}</div>
              <div className='text-gray-500 text-xs'>
                Followed by {suggestion.followedBy}{' '}
                {suggestion.time && `+ ${suggestion.time}`}
              </div>
            </div>
            <button className='text-blue-500 text-xs font-semibold'>
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
