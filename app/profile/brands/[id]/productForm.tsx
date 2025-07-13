import FormComponent from "@/components/ui/FormComponent";
import { useLazyGetCategoriesQuery } from "@/lib/services/category.service";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/lib/services/product.service";
import { CategoryDetailsDto } from "@/utils/models/category.model";
import { FileUploadDto, InputFormType } from "@/utils/models/common.model";
import { ProductDto, ProductFormDto } from "@/utils/models/product.model";
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
    name: "imageUrl",
    key: "imageUrl",
    label: "Image",
    type: "file",
  },
  {
    name: "categoryId",
    key: "categoryId",
    label: "Category",
    type: "select",
    validation: "nullValidation",
    selectInputList: [],
  },
  {
    name: "subcategory",
    key: "subcategory",
    label: "Sub Category",
    type: "select",
    validation: "nullValidation",
    isMulti: true,
    selectInputList: [],
  },
];

interface State {
  isImageUploading: boolean;
  formList: InputFormType[];
  allCategories: CategoryDetailsDto[];
  isLoading: boolean;
}

const initialState: State = {
  isImageUploading: false,
  formList: formList,
  allCategories: [] as CategoryDetailsDto[],
  isLoading: false,
};

const ProductForm = ({
  callBack,
  brandId,
  modifyProduct,
}: {
  callBack: () => void;
  brandId: string;
  modifyProduct: ProductDto;
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
  } = useForm<ProductFormDto>({
    defaultValues: {
      name: "",
      brandId: "",
      categoryId: "",
      description: "",
      imageUrl: "",
      subcategory: [],
    },
    mode: "onSubmit",
  });

  const [addProduct, { isError: addProductError }] = useCreateProductMutation();

  const [updateProduct, { isError: updateProductError }] =
    useUpdateProductMutation();

  const [getCategories] = useLazyGetCategoriesQuery();
  //#endregion
  //#region Internal Hooks
  const [productScreenStates, setProductScreenStates] = useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setProductScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );

  useEffect(() => {
    getCategoriesList().then(() => {
      if (Object.keys(modifyProduct).length) {
        reset({
          name: modifyProduct.name,
          imageUrl: modifyProduct.imageUrl,
          categoryId: modifyProduct.categoryId,
          subcategory: modifyProduct.subcategory,
          description: modifyProduct.description,
        });
        handleCategoryChange(modifyProduct.categoryId);
      } else {
        reset({
          name: "",
          imageUrl: "",
          categoryId: "",
          subcategory: [],
          description: "",
        });
      }
    });
  }, [modifyProduct]);

  useEffect(() => {
    // setValue('subcategory', []);
    handleCategoryChange(watch("categoryId"));
  }, [watch("categoryId")]);
  //#endregion

  //#region Internal Function
  const getCategoriesList = async () => {
    const res = await getCategories().unwrap();
    if (res) {
      let hideCategories = res.filter((category) => !category.hidden);
      updateState({ allCategories: hideCategories });
      const categoryList = hideCategories.map((category) => {
        return {
          label: category.name,
          value: category._id || "",
        };
      });
      updateState({
        formList: formList.map((form) => {
          if (form.key === "categoryId") {
            return {
              ...form,
              selectInputList: categoryList,
            };
          }
          return form;
        }),
      });
    } else {
      toast.error("Failed to fetch categories!");
    }
  };

  const handleCategoryChange = async (value: string) => {
    if (productScreenStates.allCategories.length) {
      const selectedCategory = productScreenStates.allCategories.find(
        (category) => category._id === value
      )?.subcategories;
      if (selectedCategory) {
        const subcategoryList = selectedCategory.map((subcategory) => {
          return {
            label: subcategory.name,
            value: subcategory._id || "",
          };
        });
        updateState({
          formList: productScreenStates.formList.map((form) => {
            if (form.key === "subcategory") {
              return {
                ...form,
                selectInputList: subcategoryList,
              };
            }
            return form;
          }),
        });
      }
    }
  };

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
      setValue(key as keyof ProductFormDto, data.url);
      updateState({ isImageUploading: false });
    }
    console.log("Uploaded File ID:", data);
  };

  const onSubmit = async (data: ProductFormDto) => {
    updateState({ isLoading: true });
    data.brandId = brandId;
    if (Object.keys(modifyProduct).length) {
      const updatedData = {
        ...modifyProduct,
        ...data,
      };
      const res = await updateProduct({
        id: modifyProduct._id,
        data: updatedData,
      }).unwrap();
      if (res) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Product creation failed!");
      }
    } else {
      const res = await addProduct(data).unwrap();
      if (res) {
        toast.success("Product Created Successfully!");
      }
    }
    updateState({ isLoading: false });
    setTimeout(() => {
      callBack();
    }, 500);
  };
  //#endregion
  return (
    <div className='rounded w-full md:col-span-3'>
      <div className='flex items-center'>
        <ArrowLeft onClick={callBack} className='cursor-pointer' />
        <h2 className='m-auto'>
          {modifyProduct ? "Edit Product" : "Add Product"}
        </h2>
      </div>

      <FormComponent<ProductFormDto>
        formList={productScreenStates.formList}
        control={control}
        errors={errors}
        submitButtonText='Save Changes'
        handleSubmit={formHandleSubmit}
        submit={onSubmit}
        isSubmitting={productScreenStates.isLoading}
        handleFile={handleFileUpload}
        gridSize={1}
        submitBtnDisabled={
          productScreenStates.isLoading || productScreenStates.isImageUploading
        }
      />
    </div>
  );
};

export default ProductForm;
