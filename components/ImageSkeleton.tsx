'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ImageSkeletonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loader?: ({ src }: { src: string }) => string;
  onError?: (e: any) => void;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onClick?: (e: any) => void;
}

export default function ImageSkeleton({
  src,
  alt,
  width,
  height,
  className = '',
  loader,
  onError,
  priority,
  fill,
  sizes,
  quality,
  placeholder,
  blurDataURL,
  onClick,
}: ImageSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className='relative' style={!fill ? { width, height } : undefined}>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded`}
          style={!fill ? { width, height } : undefined}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoadingComplete={handleLoadingComplete}
        loader={loader}
        onError={onError}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onClick={onClick}
      />
    </div>
  );
}
