"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetBrandListQuery,
  useVerifyUnverifyBrandMutation,
} from "@/lib/services/brand.service";
import ImageSkeleton from "@/components/ImageSkeleton";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/LoadingComponent";
import toast from "react-hot-toast";

const Brands = () => {
  const { data: brandList, isLoading, isError } = useGetBrandListQuery();

  const [brandVerify, { isLoading: brandVerifyLoading }] =
    useVerifyUnverifyBrandMutation();

  const handleBrandVerification = async (id: string, isVerified: boolean) => {
    const res = await brandVerify({ id, isVerified }).unwrap();
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <div>Error loading brand list.</div>;
  }
  if (!brandList) return <div>No brand list available.</div>;
  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brandList.brands.map((brands) => (
            <TableRow key={brands._id}>
              <TableCell>
                <ImageSkeleton
                  src={brands.logoUrl}
                  alt={brands.name}
                  width={50}
                  height={50}
                  className="rounded-full object-contain w-10 h-10"
                />
              </TableCell>
              <TableCell className="font-medium">{brands.name}</TableCell>
              <TableCell>{brands.description}</TableCell>
              <TableCell>
                <a
                  href={brands.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {brands.website}
                </a>
              </TableCell>
              <TableCell>{brands.ownerId.name}</TableCell>
              <TableCell>{brands.ownerId.email}</TableCell>
              <TableCell>
                {brands.isVerified ? `Approved` : "Pending"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  title={brands.isVerified ? `Approved` : "Approve"}
                  className="bg-green-600 hover:bg-green-600 hover:text-white"
                  onClick={() => handleBrandVerification(brands._id, true)}
                  disabled={brands.isVerified}
                />
                <Button
                  title="Reject"
                  className="bg-red-500 hover:bg-red-600 hover:text-white"
                  onClick={() => handleBrandVerification(brands._id, false)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Brands;
