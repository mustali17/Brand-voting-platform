import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/authOptions';
import InfiniteScroll from '@/components/InfiniteScroll';

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }
  return (
    <main className='min-h-screen p-6 bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Infinite Scroll Demo</h1>
      <InfiniteScroll />
    </main>
  );
};

export default Dashboard;
