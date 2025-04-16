'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import Brand from './brand';
import Products from './products';
import { Camera, LinkIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Post from './post';
import { Button } from '@/components/ui/button';

interface State {}
const initialState: State = {};

const UserProfile = () => {
  //#region External Hooks
  const { data: session, status: sessionStatus } = useSession();
  //#endregion

  //#region Internal Hooks
  const [userProfileScreenStates, setUserProfileScreenStates] =
    useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setUserProfileScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );
  //#endregion

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col min-h-screen max-w-7xl w-full text-black'>
        {/* Profile Header */}
        <div className='flex items-center  justify-center px-4 py-6 gap-4'>
          <div>
            <Image
              src='/images/post.jpg'
              alt='Profile picture'
              width={150}
              height={150}
              className='rounded-full w-48 h-48 mr-4 object-cover'
            />
          </div>
          <div className='flex-1'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-normal'>{session?.user?.name}</h1>
                <div className='flex gap-2'>
                  <Button title='Create Brand' />
                  <Button title='Edit profile' />

                  <button className='p-1'>
                    <Settings className='w-6 h-6' />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className='flex gap-6 text-sm'>
                <div>
                  <span className='font-semibold'>0</span> posts
                </div>
                <div>
                  <span className='font-semibold'>85</span> followers
                </div>
                {/* <div>
                  <span className='font-semibold'>114</span> following
                </div> */}
              </div>

              {/* Bio */}
              <div className='text-sm space-y-1'>
                <div>محمد ♥</div>
                <div>
                  Time changes everything{' '}
                  <span className='text-amber-400'>🔥</span>
                </div>
                <div className='flex items-center gap-1'>
                  <LinkIcon className='w-3.5 h-3.5' />
                  <Link
                    href='https://www.linkedin.com/in/mohammad-katwara'
                    className='text-blue-400'
                  >
                    www.linkedin.com/in/mohammad-katwara
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className='mt-8 border-t border-zinc-800'>
          <div className='flex justify-center'>
            <button className='px-16 py-3 border-t border-white flex items-center justify-center gap-1'>
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M4 0H0V4H4V0ZM12 0H8V4H12V0ZM4 8H0V12H4V8ZM12 8H8V12H12V8Z' />
              </svg>
              <span className='text-xs font-semibold'>POSTS</span>
            </button>
          </div>
        </div>

        {/* Empty Posts State */}
        <div className='flex-1 flex flex-col items-center justify-center py-16'>
          <Post />
        </div>
      </div>
      <div className='max-w-2xl w-full p-4'>
        <Brand />
        <Products />
      </div>
    </div>
  );
};

export default UserProfile;
