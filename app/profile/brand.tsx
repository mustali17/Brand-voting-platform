'use client';
import FormComponent from '@/components/ui/FormComponent';
import { useCreateBrandMutation } from '@/lib/services/brand.service';

import { BrandDto } from '@/utils/models/brand.model';
import { InputFormType } from '@/utils/models/common.model';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const formList: InputFormType[] = [
  {
    name: 'name',
    key: 'name',
    label: 'Full Name',
    type: 'text',
    validation: 'nullValidation',
  },
  {
    name: 'logoUrl',
    key: 'logoUrl',
    label: 'Logo',
    type: 'file',
  },
  {
    name: 'website',
    key: 'website',
    label: 'Website',
    type: 'file',
  },
  {
    name: 'description',
    key: 'description',
    label: 'description',
    type: 'textarea',
    validation: 'nullValidation',
  },
];

interface State {}

const initialState: State = {};

const Brand = () => {
  //#region External Hooks
  const { data: session, status: sessionStatus } = useSession();
  const {
    control,
    handleSubmit: formHandleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<BrandDto>({
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      description: '',
    },
    mode: 'onSubmit',
  });

  const [addBrand, { isLoading: addBrandLoading, isError: addBrandError }] =
    useCreateBrandMutation();
  //#endregion

  //#region Internal Hooks
  const [brandScreenStates, setBrandScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setBrandScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );

  useEffect(() => {}, []);

  //#endregion

  //#region Internal Hook
  const handleFileUpload = async (file: File, key: string) => {
    debugger;
    const res = await fetch('/api/uploadToDrive', {
      method: 'POST',
      body: file,
    });

    const data = await res.json();
    console.log('Uploaded File ID:', data);
  };
  const onSubmit = async (data: BrandDto) => {};
  //#endregion

  return (
    <>
      <FormComponent<BrandDto>
        formList={formList}
        control={control}
        errors={errors}
        submitButtonText='Sign up'
        handleSubmit={formHandleSubmit}
        submit={onSubmit}
        isSubmitting={addBrandLoading}
        gridSize={2}
        handleFile={handleFileUpload}
      />
    </>
  );
};

export default Brand;
