import FormComponent from "@/components/ui/FormComponent";
import {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
} from "@/lib/services/category.service";
import { useCreateProductMutation } from "@/lib/services/product.service";
import { FileUploadDto, InputFormType } from "@/utils/models/common.model";
import { ProductDto } from "@/utils/models/product.model";
import { ArrowLeft } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
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
    name: "imageUrl",
    key: "imageUrl",
    label: "Image",
    type: "file",
  },
  {
    name: "category",
    key: "category",
    label: "Category",
    type: "select",
    validation: "nullValidation",
    selectInputList: [
      {
        label: "Fashion",
        value: "Fashion",
      },
    ],
  },
  {
    name: "subcategory",
    key: "subcategory",
    label: "Sub Category",
    type: "select",
    validation: "nullValidation",
    isMulti: true,
    selectInputList: [
      {
        label: "shoes",
        value: "shoes",
      },
      {
        label: "shirt",
        value: "shirt",
      },
    ],
  },
];

interface State {
  isImageUploading: boolean;
}

const initialState: State = {
  isImageUploading: false,
};

const ProductForm = ({
  callBack,
  brandId,
}: {
  callBack: () => void;
  brandId: string;
}) => {
  //#region External Hooks
  const {
    control,
    handleSubmit: formHandleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ProductDto>({
    defaultValues: {
      name: "",
      brandId: "",
      category: "",
      description: "",
      imageUrl: "",
      subcategory: "",
    },
    mode: "onSubmit",
  });

  const [
    addProduct,
    { isLoading: addProductLoading, isError: addProductError },
  ] = useCreateProductMutation();

  const [getCategory] = useLazyGetCategoriesQuery();
  //#endregion
  //#region Internal Hooks
  const [productScreenStates, setProductScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setProductScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );

  useEffect(() => {}, []);
  //#endregion
  //#region Internal Function
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
      setValue(key as keyof ProductDto, data.url);
      updateState({ isImageUploading: false });
    }
    console.log("Uploaded File ID:", data);
  };

  const onSubmit = async (data: ProductDto) => {
    console.log("Product Data: ", data);
    data.brandId = brandId;
    const res = await addProduct(data).unwrap();
    console.log("Product Created: ", res);
    if (res) {
      toast.success("Product Created Successfully!");
    }
  };
  //#endregion
  return (
    <div className='rounded w-full md:col-span-3'>
      <div className='flex items-center'>
        <ArrowLeft onClick={callBack} className='cursor-pointer' />
        <h2 className='m-auto'>{"Add Product"}</h2>
      </div>

      <FormComponent<ProductDto>
        formList={formList}
        control={control}
        errors={errors}
        submitButtonText='Save Changes'
        handleSubmit={formHandleSubmit}
        submit={onSubmit}
        isSubmitting={addProductLoading}
        handleFile={handleFileUpload}
        gridSize={1}
        submitBtnDisabled={productScreenStates.isImageUploading}
      />
    </div>
  );
};

export default ProductForm;
