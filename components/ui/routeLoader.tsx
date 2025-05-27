// components/RouteLoader.tsx
'use client';

import LoadingComponent from '../LoadingComponent';
import { useRouteLoading } from '../loadingProvider';

export default function RouteLoader() {
  const { loading } = useRouteLoading();

  if (!loading) return null;

  return (
    <div className='fixed inset-0 z-[9999] bg-white/70 flex items-center justify-center'>
      <LoadingComponent />
    </div>
  );
}
