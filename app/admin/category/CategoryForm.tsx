// import FormComponent from '@/components/ui/FormComponent';
// import { CategoryDetailsDto } from '@/utils/models/category.model';
// import { InputFormType } from '@/utils/models/common.model';
// import { ArrowLeft } from 'lucide-react';
// import React from 'react';
// import { useForm } from 'react-hook-form';

// const formList: InputFormType[] = [];

// const CategoryForm = ({
//   callBack,
//   categoryData,
// }: {
//   callBack: () => void;
//   categoryData: CategoryDetailsDto;
// }) => {
//   //#region External Hooks
//   const {
//     control,
//     handleSubmit: formHandleSubmit,
//     setError,
//     watch,
//     setValue,
//     reset,
//     formState: { errors, isValid },
//   } = useForm<CategoryDetailsDto>({
//     defaultValues: {
//       name: '',
//       logoUrl: '',
//       website: '',
//       description: '',
//     },
//     mode: 'onChange',
//   });
//   //#endregion

//   return (
//     <div className='rounded w-full md:col-span-3 mt-5 flex-1'>
//       <div className='flex items-center'>
//         <ArrowLeft onClick={callBack} className='cursor-pointer' />
//         <h2 className='m-auto'>
//           {categoryData ? 'Edit Brand' : 'Add New Brand'}
//         </h2>
//       </div>

//       <FormComponent<BrandFormDto>
//         formList={formList}
//         control={control}
//         errors={errors}
//         submitButtonText='Save Changes'
//         handleSubmit={formHandleSubmit}
//         submit={onSubmit}
//         isSubmitting={addBrandLoading}
//         handleFile={handleFileUpload}
//         gridSize={1}
//         submitBtnDisabled={
//           addBrandLoading ||
//           updateBrandLoading ||
//           brandScreenStates.isImageUploading
//         }
//       />
//     </div>
//   );
// };

// export default CategoryForm;

import React from 'react';

const CategoryForm = () => {
  return <div>CategoryForm</div>;
};

export default CategoryForm;
