"use client";
import FormComponent from "@/components/ui/FormComponent";
import { useCreateBrandMutation } from "@/lib/services/brand.service";

import { BrandDto, BrandFormDto } from "@/utils/models/brand.model";
import { FileUploadDto, InputFormType } from "@/utils/models/common.model";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const formList: InputFormType[] = [
  {
    name: "name",
    key: "name",
    label: "Full Name",
    type: "text",
    validation: "nullValidation",
  },
  {
    name: "description",
    key: "description",
    label: "Description",
    type: "textarea",
    validation: "nullValidation",
  },
  {
    name: "logoUrl",
    key: "logoUrl",
    label: "Logo",
    type: "file",
  },
  {
    name: "website",
    key: "website",
    label: "Website",
    type: "text",
    validation: "nullValidation",
  },
];

interface State {
  isImageUploading: boolean;
}

const initialState: State = {
  isImageUploading: false,
};

const BrandForm = ({ brandData }: { brandData: BrandDto }) => {
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
      name: "",
      logoUrl: "",
      website: "",
      description: "",
    },
    mode: "onSubmit",
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

  useEffect(() => {
    if (brandData) {
      reset({
        name: brandData.name,
        logoUrl: brandData.logoUrl,
        website: brandData.website,
        description: brandData.description,
      });
    }
  }, [brandData]);
  console.log("Brand Data:", brandData);
  //#endregion

  //#region Internal Hook
  const handleFileUpload = async (file: File, key: string) => {
    updateState({ isImageUploading: true });

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploadToDrive", {
      method: "POST",
      body: formData,
    });

    const data: FileUploadDto = await res.json();
    if (data.fileId) {
      setValue(key as keyof BrandFormDto, data.url);
      updateState({ isImageUploading: false });
    }
  };
  const onSubmit = async (data: BrandFormDto) => {
    console.log("Form Data:", data);
    if (data) {
      const res = await addBrand(data).unwrap();
      if (res) toast.success("Brand created successfully!");
    } else {
      toast.error("Brand creation failed!");
    }
  };
  //#endregion

  return (
    <div className='shadow-lg rounded w-full'>
      <h2 className='mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900'>
        Register Your Brand
      </h2>
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
          addBrandLoading || brandScreenStates.isImageUploading
        }
      />
    </div>
  );
};

export default BrandForm;
