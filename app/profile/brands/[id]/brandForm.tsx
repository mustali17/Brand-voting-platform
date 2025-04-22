"use client";
import FormComponent from "@/components/ui/FormComponent";
import { useCreateBrandMutation } from "@/lib/services/brand.service";

import { BrandDto, BrandFormDto } from "@/utils/models/brand.model";
import { FileUploadDto, InputFormType } from "@/utils/models/common.model";
import { ArrowLeft } from "lucide-react";
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
    if (brandData) {
      const updatedData = {
        ...data,
        name: data.name,
        logoUrl: data.logoUrl,
        website: data.website,
        description: data.description,
      };
      // update call
    } else {
      if (data) {
        const res = await addBrand(data).unwrap();
        if (res) toast.success("Brand created successfully!");
      } else {
        toast.error("Brand creation failed!");
      }
    }
  };
  //#endregion

  return (
    <div className='rounded w-full md:col-span-3'>
      <div className='flex items-center'>
        <ArrowLeft onClick={callBack} className='cursor-pointer' />
        <h2 className='m-auto'>{brandData ? "Edit Brand" : "Add New Brand"}</h2>
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
          addBrandLoading || brandScreenStates.isImageUploading
        }
      />
    </div>
  );
};

export default BrandForm;
