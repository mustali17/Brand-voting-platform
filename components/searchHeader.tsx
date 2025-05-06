'use client';

import { ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchHeader({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const router = useRouter();

  return (
    <div className='sticky top-0 z-10 w-full bg-white p-4 shadow-sm'>
      <div className='flex items-center gap-2'>
        <div onClick={() => router.back()} className='cursor-pointer'>
          <ArrowLeft className='w-5 h-5' />
        </div>

        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            className='pl-9 h-10 w-full rounded-full border-gray-300'
            placeholder='Search'
            type='search'
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
