'use client';
import CategoryList from '@/components/categoryList';
import { SearchHeader } from '@/components/searchHeader';
import { useGetCategoriesQuery } from '@/lib/services/category.service';
import { CommonCategoryDto } from '@/utils/models/category.model';
import { useEffect, useState } from 'react';

const Category = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    filteredCategories(searchValue);
  }, [searchValue]);

  const filteredCategories = (value: string): CommonCategoryDto[] => {
    if (!categories) return [];

    return categories
      .filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      )
      .map((category) => {
        return {
          _id: category._id,
          name: category.name,
          imageUrl: category.imageUrl,
        };
      });
  };

  const filteredSubCategories = (
    value: string,
    categoryId: string
  ): CommonCategoryDto[] => {
    if (!categories) return [];

    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );

    if (!selectedCategory) return [];

    return selectedCategory.subcategories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
  };

  return (
    <main className='flex min-h-screen flex-col bg-white'>
      <SearchHeader onSearch={(value: string) => setSearchValue(value)} />
      {selectedCategory ? (
        <>
          <h1 className='p-4 text-xl font-bold'>Sub Category</h1>
          <CategoryList
            categories={
              filteredSubCategories(searchValue, selectedCategory) || []
            }
            isLoading={isLoading}
            isError={isError}
            categoryClickHandler={(category) => {}}
          />
        </>
      ) : (
        <>
          <h1 className='p-4 text-xl font-bold'>Categories</h1>
          <CategoryList
            categories={filteredCategories(searchValue) || []}
            isLoading={isLoading}
            isError={isError}
            categoryClickHandler={(category) =>
              setSelectedCategory(category._id)
            }
          />
        </>
      )}
    </main>
  );
};

export default Category;
