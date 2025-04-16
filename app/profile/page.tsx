'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import Brand from './brand';
import Products from './products';

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
    <div className=''>
      <div className='max-w-2xl p-4'>
        <h1>Welcome {session?.user?.name}</h1>
        <Brand />
        <Products />
      </div>
    </div>
  );
};

export default UserProfile;
