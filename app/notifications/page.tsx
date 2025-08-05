import ImageSkeleton from '@/components/ImageSkeleton';
import React from 'react';

const Notifications = () => {
  return (
    <div
      className='flex flex-col items-center justify-center w-full overflow-hidden'
      style={{ height: '70vh' }}
    >
      <ImageSkeleton
        src='/images/not-found.svg'
        alt='No Brands Found'
        width={150}
        height={150}
        className='mb-4'
      />
      <p className='mt-4 text-gray-600'>You have no new notifications.</p>
    </div>
  );
};

export default Notifications;
