'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

const AdminLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  console.log('AdminLayout session:', session);
  if (!session || !session.user || session.user.role !== 'admin') {
    router.replace('/login');
    return <h1>Redirecting...</h1>;
  }

  return <>{children}</>;
};

export default AdminLayout;
