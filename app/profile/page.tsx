'use client';
import { BrandDto } from '@/utils/models/brand.model';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Brand from './brand';

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
    <>
      <div>
        <h1>Welcome {session?.user?.name}</h1>
        <Brand />
      </div>
    </>
  );
};

export default UserProfile;
