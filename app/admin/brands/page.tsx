'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetBrandListQuery,
  useUpdateBrandMutation,
} from '@/lib/services/brand.service';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LoadingComponent from '@/components/LoadingComponent';

const Brands = () => {
  const { data: brandList, isLoading, isError } = useGetBrandListQuery();

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <div>Error loading brand list.</div>;
  }
  if (!brandList) return <div>No brand list available.</div>;
  return (
    <div className='w-full p-4'>
      <h2 className='text-2xl font-bold mb-4'>Brands</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Logo</TableHead>
            <TableHead className='w-[100px]'>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brandList.brands.map((brands) => (
            <TableRow key={brands._id}>
              <TableCell>
                <Image
                  src={brands.logoUrl}
                  alt={brands.name}
                  width={50}
                  height={50}
                  className='rounded-full object-cover w-10 h-10'
                />
              </TableCell>
              <TableCell className='font-medium'>{brands.name}</TableCell>
              <TableCell>{brands.description}</TableCell>
              <TableCell>
                <a
                  href={brands.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {brands.website}
                </a>
              </TableCell>
              <TableCell>{brands.ownerId.name}</TableCell>
              <TableCell>{brands.ownerId.email}</TableCell>
              <TableCell className='flex gap-2'>
                <Button title='Approve' className='bg-green-400' />
                <Button title='Reject' className='bg-red-400' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Brands;
