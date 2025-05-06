'use client';
import FormComponent from '@/components/ui/FormComponent';
import { updateUser } from '@/lib/features/user/userSlice';
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from '@/lib/services/brand.service';

import { BrandDto, BrandFormDto } from '@/utils/models/brand.model';
import { FileUploadDto, InputFormType } from '@/utils/models/common.model';
import { RootState } from '@reduxjs/toolkit/query';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const formList: InputFormType[] = [
  {
    name: 'name',
    key: 'name',
    label: 'Full Name',
    type: 'text',
    validation: 'nullValidation',
  },
  {
    name: 'description',
    key: 'description',
    label: 'Description',
    type: 'textarea',
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
    type: 'text',
    validation: 'websiteUrlValidation',
  },
];

interface State {
  isImageUploading: boolean;
}

const initialState: State = {
  isImageUploading: false,
};

const BrandForm = ({
  brandData,
  callBack,
}: {
  brandData?: BrandDto;
  callBack: () => void;
}) => {
  //#region External Hooks
  const {
    control,
    handleSubmit: formHandleSubmit,
    setError,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<BrandFormDto>({
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      description: '',
    },
    mode: 'onChange',
  });

  const [addBrand, { isLoading: addBrandLoading, isError: addBrandError }] =
    useCreateBrandMutation();
  const [
    updateBrand,
    { isLoading: updateBrandLoading, isError: updateBrandError },
  ] = useUpdateBrandMutation();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  //#endregion

  //#region Internal Hooks
  const [brandScreenStates, setBrandScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setBrandScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );

  useEffect(() => {
    if (brandData && Object.keys(brandData).length) {
      reset({
        name: brandData.name,
        logoUrl: brandData.logoUrl,
        website: brandData.website,
        description: brandData.description,
      });
    } else {
      reset({
        name: '',
        logoUrl: '',
        website: '',
        description: '',
      });
    }
  }, [brandData]);
  //#endregion

  //#region Internal Hook
  const handleFileUpload = async (file: File, key: string) => {
    updateState({ isImageUploading: true });

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/uploadToDrive', {
      method: 'POST',
      body: formData,
    });

    const data: FileUploadDto = await res.json();
    if (data.fileId) {
      setValue(key as keyof BrandFormDto, data.url);
      updateState({ isImageUploading: false });
    }
  };
  const onSubmit = async (data: BrandFormDto) => {
    if (brandData) {
      const updatedData = {
        ...brandData,
        name: data.name,
        logoUrl: data.logoUrl,
        website: data.website,
        description: data.description,
      };

      const res = await updateBrand({
        id: brandData._id,
        data: updatedData,
      }).unwrap();
      if (res) {
        dispatch(
          updateUser({
            ownedBrands: user?.ownedBrands.map((brand: BrandDto) =>
              brand._id === res.brand._id ? res.brand : brand
            ),
          })
        );
        toast.success('Brand updated successfully!');
      } else {
        toast.error('Brand creation failed!');
      }
    } else {
      if (data) {
        const res = await addBrand(data).unwrap();
        if (res) {
          dispatch(
            updateUser({ ownedBrands: [...user?.ownedBrands, res.brand] })
          );
          toast.success('Brand created successfully!');
        }
      } else {
        toast.error('Brand creation failed!');
      }
    }
    setTimeout(() => {
      callBack();
    }, 500);
  };
  //#endregion

  return (
    <div className='rounded w-full md:col-span-3 mt-5'>
      <div className='flex items-center'>
        <ArrowLeft onClick={callBack} className='cursor-pointer' />
        <h2 className='m-auto'>{brandData ? 'Edit Brand' : 'Add New Brand'}</h2>
      </div>

      <FormComponent<BrandFormDto>
        formList={formList}
        control={control}
        errors={errors}
        submitButtonText='Save Changes'
        handleSubmit={formHandleSubmit}
        submit={onSubmit}
        isSubmitting={addBrandLoading}
        handleFile={handleFileUpload}
        gridSize={1}
        submitBtnDisabled={
          addBrandLoading ||
          updateBrandLoading ||
          brandScreenStates.isImageUploading
        }
      />
    </div>
  );
};

export default BrandForm;
