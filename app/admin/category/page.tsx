'use client';
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
import Image from 'next/image';
import React from 'react';

const Category = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  if (isLoading) {
    return <LoadingComponent />;
  }
  if (!categories) return;
  return (
    <div className='w-full p-4'>
      <h2 className='text-2xl font-bold mb-4'>Category</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sub Categories</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={50}
                  height={50}
                  className='rounded-full object-cover w-10 h-10'
                />
              </TableCell>
              <TableCell className='font-medium'>{cat.name}</TableCell>
              <TableCell>
                {cat.subcategories.map((subCat) => subCat.name + ',')}
              </TableCell>

              <TableCell className='flex gap-2'>
                <Button
                  title='Edit'
                  className='bg-green-400 hover:bg-green-600 hover:text-white'
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Category;
