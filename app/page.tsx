'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Hash,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const route = useRouter();
  return (
    <div className='flex h-screen bg-white'>
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
              <Search className='mr-3 h-5 w-5' />
              Search
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
            >
              <Film className='mr-3 h-5 w-5' />
              Reels
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <MessageCircle className='mr-3 h-5 w-5' />
              <div className='flex items-center'>
                Messages
                <span className='ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  8
                </span>
              </div>
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Heart className='mr-3 h-5 w-5' />
              Notifications
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <PlusSquare className='mr-3 h-5 w-5' />
              Create
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Hash className='mr-3 h-5 w-5' />
              Generate HashTags
            </Link>
            <Link
              href='#'
              className='flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100'
            >
              <Hash className='mr-3 h-5 w-5' />
              Hashtags Metrics
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
            <div className='border-b border-gray-300 pb-4'>
              {/* Post Header */}
              <div className='flex items-center p-3'>
                <div className='flex items-center'>
                  <Image
                    src='/images/post.jpg'
                    alt='Profile'
                    width={56}
                    height={56}
                    className='rounded-full w-8 h-8 mr-4'
                  />

                  <div className='flex items-center'>
                    <span className='font-semibold text-sm'>naughtyworld</span>
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
                  src='/images/post.jpg'
                  width={500}
                  height={150}
                  className='w-full object-cover rounded-lg h-[400px]'
                />
              </div>
              {/* reaction */}
              <div className='flex justify-center mt-2  items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700'>
                <ThumbsUp className='w-4 h-4 cursor-pointer hover:text-blue-500' />
                <span className='text-sm font-medium'>754</span>
                <ThumbsDown className='w-4 h-4 cursor-pointer hover:text-red-500' />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden border-t border-gray-300 py-2 bg-white fixed bottom-0 left-0 right-0'>
          <div className='flex justify-around'>
            <button className='p-2'>
              <Home className='h-6 w-6' />
            </button>
            <button className='p-2'>
              <Search className='h-6 w-6' />
            </button>
            <button className='p-2'>
              <Compass className='h-6 w-6' />
            </button>
            <button className='p-2'>
              <Film className='h-6 w-6' />
            </button>
            <button className='p-2 relative'>
              <MessageCircle className='h-6 w-6' />
              <span className='absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                8
              </span>
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
