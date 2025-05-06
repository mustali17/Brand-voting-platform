'use client';
import { CategoriesSlider } from '@/components/categoriesSlider';
import InfiniteScroll from '@/components/InfiniteScroll';
import SearchOverlay from '@/components/searchOverkay';
import { setUser } from '@/lib/features/user/userSlice';
import { useLazyGetUserByIdQuery } from '@/lib/services/user.service';
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
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HomePage() {
  const route = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [fetchUserDataById] = useLazyGetUserByIdQuery();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      route.replace('/login');
    } else if (sessionStatus === 'authenticated') {
      getUserDataById();
    }
  }, [sessionStatus]);

  //#region Internal Function
  const getUserDataById = async () => {
    if (session?.user?.id) {
      const userData = await fetchUserDataById(session?.user?.id).unwrap();
      userData && dispatch(setUser(userData));
    }
  };
  //#endregion

  return (
    <div className='flex h-screen bg-white pt-2 w-full'>
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile Header */}

        <div className='flex-1 overflow-y-auto'>
          <CategoriesSlider />

          {/* Feed */}
          <div className='max-w-xl mx-auto w-full'>
            {/* Post */}
            <InfiniteScroll />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Suggestions */}
      <div className='w-22 border-l border-gray-300 p-4 hidden lg:block'>
        <div
          className='flex items-center mb-6 cursor-pointer'
          onClick={() => route.push('/profile')}
        >
          <div className='font-semibold'>{user?.name}</div>
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
