'use client';
import { CategoriesSlider } from '@/components/categoriesSlider';
import InfiniteScroll from '@/components/InfiniteScroll';
import RightSideBar from '@/components/RightSideBar';
import SearchOverlay from '@/components/searchOverkay';
import { setUser } from '@/lib/features/user/userSlice';
import { useLazyGetUserByIdQuery } from '@/lib/services/user.service';
import { RootState } from '@/lib/store';
import { UserDto } from '@/utils/models/user.model';
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
  const { user } = useSelector((state: RootState) => state.user);

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
      <RightSideBar user={user || ({} as UserDto)} />
    </div>
  );
}
