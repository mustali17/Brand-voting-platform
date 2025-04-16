import FormComponent from '@/components/ui/FormComponent';
import { useCreateProductMutation } from '@/lib/services/product.service';
import { FileUploadDto, InputFormType } from '@/utils/models/common.model';
import { ProductDto } from '@/utils/models/product.model';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
    name: 'imageUrl',
    key: 'imageUrl',
    label: 'Image',
    type: 'file',
  },
  {
    name: 'category',
    key: 'category',
    label: 'Category',
    type: 'select',
    validation: 'nullValidation',
    selectInputList: [
      {
        label: 'Fashion',
        value: 'Fashion',
      },
    ],
  },
  {
    name: 'subcategory',
    key: 'subcategory',
    label: 'Sub Category',
    type: 'select',
    validation: 'nullValidation',
    isMulti: true,
    selectInputList: [
      {
        label: 'shoes',
        value: 'shoes',
      },
      {
        label: 'shirt',
        value: 'shirt',
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

const Products = () => {
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
      name: '',
      brandId: '',
      category: '',
      description: '',
      imageUrl: '',
      subcategory: '',
    },
    mode: 'onSubmit',
  });

  const [
    addProduct,
    { isLoading: addProductLoading, isError: addProductError },
  ] = useCreateProductMutation();
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
      setValue(key as keyof ProductDto, data.url);
      updateState({ isImageUploading: false });
    }
    console.log('Uploaded File ID:', data);
  };

  const onSubmit = async (data: ProductDto) => {
    console.log('Product Data: ', data);
    data.brandId = '67ff6f742dc645c9a4c0b637';
    data.subcategory = Array.isArray(data.subcategory)
      ? data.subcategory.join(',')
      : data.subcategory;
    const res = await addProduct(data).unwrap();
    console.log('Product Created: ', res);
    if (res) {
      toast.success('Product Created Successfully!');
    }
  };
  //#endregion
  return (
    <div className='shadow-lg rounded'>
      <h2 className='mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900'>
        Add Product
      </h2>
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

export default Products;
