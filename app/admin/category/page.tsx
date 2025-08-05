'use client';
import CategoryForm from '@/components/categoryForm';
import LoadingComponent from '@/components/LoadingComponent';
import { Button } from '@/components/ui/button';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { useGetCategoriesQuery } from '@/lib/services/category.service';
import {
  CategoryDetailsDto,
  CategoryFormDto,
} from '@/utils/models/category.model';
import ImageSkeleton from '@/components/ImageSkeleton';
import React, { useCallback, useState } from 'react';
interface State {
  isAddOrEditCategory: boolean;
  editCategoryData: CategoryFormDto;
}
const initialState: State = {
  isAddOrEditCategory: false,
  editCategoryData: {} as CategoryFormDto,
};

const Category = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  //#region Internal Hooks
  const [categoryScreenStates, setCategoryScreenStates] =
    useState(initialState);

  const updateState = useCallback(
    (updates: Partial<State>) =>
      setCategoryScreenStates((prev) => ({ ...prev, ...updates })),
    []
  );
  //#endregion

  const prepareCatFormData = (category: CategoryDetailsDto) => {
    const data: CategoryFormDto = {
      _id: category._id,
      categoryImageURL: category.categoryImageURL,
      name: category.name,
      subcategories: category.subcategories,
      hidden: category.hidden,
    };
    updateState({ editCategoryData: data });
  };

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (!categories) return;
  return (
    <div className='w-full p-4'>
      {categoryScreenStates.isAddOrEditCategory ? (
        <CategoryForm
          onSubmit={() => {}}
          initialData={categoryScreenStates.editCategoryData}
          callBack={() => updateState({ isAddOrEditCategory: false })}
        />
      ) : (
        <>
          <h2 className='text-2xl font-bold mb-4'>Category</h2>
          <Button
            title='Add'
            onClick={() => {
              updateState({ editCategoryData: {} as CategoryFormDto });
              updateState({ isAddOrEditCategory: true });
            }}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sub Categories</TableHead>
                <TableHead>Hide</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>
                    <ImageSkeleton
                      src={cat.categoryImageURL}
                      alt={cat.name}
                      width={50}
                      height={50}
                      className='rounded-full object-contain w-10 h-10'
                    />
                  </TableCell>
                  <TableCell className='font-medium'>{cat.name}</TableCell>
                  <TableCell>
                    {cat.subcategories.map((subCat) => subCat.name + ',')}
                  </TableCell>
                  <TableCell>{cat.hidden.toString()}</TableCell>
                  <TableCell className='flex gap-2'>
                    <Button
                      title='Edit'
                      className='bg-green-400 hover:bg-green-600 hover:text-white'
                      onClick={() => {
                        prepareCatFormData(cat);
                        updateState({ isAddOrEditCategory: true });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Category;
