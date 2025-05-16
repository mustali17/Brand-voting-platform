'use client';
import { Button } from '@/components/ui/button';
import { RootState } from '@/lib/store';
import { LinkIcon, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BrandForm from './brands/[id]/brandForm';
import { useLazyGetUserByIdQuery } from '@/lib/services/user.service';
import { setUser } from '@/lib/features/user/userSlice';
import { useRouter } from 'next/navigation';

interface State {
  isCreateBrand: boolean;
}
const initialState: State = {
  isCreateBrand: false,
};

const UserProfile = () => {
  //#region External Hooks
  const { data: session, status: sessionStatus } = useSession();
  const { user } = useSelector((state: RootState) => state.user);
  const [fetchUserDataById] = useLazyGetUserByIdQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  console.log('UserProfile', user);
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
    <div className='flex flex-col items-center w-full'>
      <div
        className={`flex flex-col min-h-screen ${
          userProfileScreenStates.isCreateBrand ? 'max-w-xl' : 'max-w-7xl'
        } w-full text-black`}
      >
        {userProfileScreenStates.isCreateBrand ? (
          <BrandForm
            callBack={() => {
              updateState({ isCreateBrand: false });
              // getUserDataById();
            }}
          />
        ) : (
          <>
            {/* Profile Header */}
            <div className='flex flex-col sm:flex-row items-center justify-center px-4 py-6 gap-4'>
              <div>
                <Image
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
                  alt='Profile picture'
                  width={150}
                  height={150}
                  className='rounded-full w-32 h-32 sm:w-48 sm:h-48 object-cover'
                />
              </div>
              <div className='flex-1'>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0'>
                    <h1 className='text-lg sm:text-xl font-normal text-center sm:text-left'>
                      {user?.name}
                    </h1>
                    <div className='flex gap-2'>
                      <Button
                        title='Create Brand'
                        onClick={() => updateState({ isCreateBrand: true })}
                      />
                      {user?.role === 'admin' && (
                        <Button
                          title='Admin Dashboard'
                          onClick={() => router.push('/admin/dashboard')}
                        />
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='flex justify-center sm:justify-start gap-6 text-sm'>
                    {/* <div>
                      <span className='font-semibold'>
                        {user?.following || 0}
                      </span>{' '}
                      followers
                    </div> */}
                  </div>
                  <div className='text-center sm:text-left'>
                    <p className='text-sm text-gray-500'>
                      Joined on{' '}
                      {new Date(user?.createdAt || '').toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {user && user?.ownedBrands.length > 0 && (
              <>
                <div className='mt-8 border-t border-zinc-800'>
                  <div className='flex justify-center'>
                    <button className='px-16 py-3 border-t border-white flex items-center justify-center gap-1'>
                      <LinkIcon />
                      <span className='text-xs font-semibold'>Brands</span>
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 py-16'>
                  {user?.ownedBrands.map((brand) => (
                    <Link
                      key={brand._id}
                      href={`/profile/brands/${brand._id}`}
                      className='flex flex-col items-center gap-2'
                    >
                      <Image
                        src={brand.logoUrl}
                        alt='Brand logo'
                        width={100}
                        height={100}
                        className='rounded-full w-24 h-24 object-cover'
                      />
                      <span className='text-sm font-semibold text-center'>
                        {brand.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
