"use client";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { LinkIcon, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Products from "./brands/[id]/productForm";

interface State {}
const initialState: State = {};

const UserProfile = () => {
  //#region External Hooks
  const { data: session, status: sessionStatus } = useSession();
  const { user } = useSelector((state: RootState) => state.user);
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
                <h1 className='text-xl font-normal'>{user?.name}</h1>
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
                  <span className='font-semibold'>{user?.following || 0}</span>{" "}
                  followers
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-500'>
                  Joined on {user?.createdAt}
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

            <div className='flex-1 flex flex-col items-center justify-center py-16'>
              <div className='flex flex-col items-start justify-center gap-4'>
                {user?.ownedBrands.map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/profile/brands/${brand._id}`}
                    className='flex items-center gap-2'
                  >
                    <Image
                      src={brand.logoUrl}
                      alt='Brand logo'
                      width={50}
                      height={50}
                      className='rounded-full w-12 h-12 object-cover'
                    />
                    <span className='text-sm font-semibold'>{brand.name}</span>
                  </Link>
                ))}
              </div>
              {/* <div className='flex items-center justify-center gap-2 mt-4'>
                <Link
                  href={`/profile/brands`}
                  className='text-sm font-semibold text-gray-500'
                >
                  See all brands
                </Link>
              </div> */}
            </div>
          </>
        )}
      </div>
      <div className='max-w-2xl w-full p-4'>
        {/* <Brand /> */}
        <Products />
      </div>
    </div>
  );
};

export default UserProfile;
