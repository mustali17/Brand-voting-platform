"use client";
import LoadingComponent from "@/components/LoadingComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAdminStatsQuery } from "@/lib/services/product.service";
import { ArrowUpRight, Award, TrendingUp, Users, Vote } from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className='grid items-start gap-8 mt-5 ps-4'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='font-heading text-3xl md:text-4xl'>Firm Corner</h1>
          <p className='text-lg text-muted-foreground'>
            Describe this platform
          </p>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.stats.totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              {data?.stats.usersChange.toFixed(2)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Votes</CardTitle>
            <Vote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.stats.totalVotes}</div>
            <p className='text-xs text-muted-foreground'>
              {data?.stats.votesChange?.toFixed(2)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Brands</CardTitle>
            <Award className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.stats.activeBrands}</div>
            <p className='text-xs text-muted-foreground'>
              {data?.stats.activeBrandsChange.toFixed(2)}% new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Engagement Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {data?.stats.engagementRate}%
            </div>
            <p className='text-xs text-muted-foreground'>
              {data?.stats.engagementChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid flex-col gap-3 mb-80'>
        <Link
          href={"/admin/brands"}
          className='underline flex flex-row items-center'
        >
          Go To Brands <ArrowUpRight />{" "}
        </Link>
        <Link
          href={"/admin/category"}
          className='underline flex flex-row items-center'
        >
          Go To Categories <ArrowUpRight />
        </Link>
        <Link
          href={"/admin/users"}
          className='underline flex flex-row items-center'
        >
          Go To Users <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
