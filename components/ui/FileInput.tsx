'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Upload, X, FileIcon, ImageIcon } from 'lucide-react';
import ImageSkeleton from '@/components/ImageSkeleton';

interface FileInputProps {
  id: string;
  name: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  onChange?: (file: File | null) => void;
  previewUrl?: string;
}

export function FileInput({
  id,
  name,
  label = 'Upload file',
  accept = 'image/*',
  maxSize = 5,
  className,
  onChange,
  previewUrl,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
      setIsUploading(false);
      setProgress(100);
    }
  }, [previewUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 5 + 2); // slower progress
          return next >= 100 ? 99 : next;
        });
      }, 400); // slower interval
    }
    return () => clearInterval(interval);
  }, [isUploading, progress]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      onChange?.(null);
      return;
    }
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);
    onChange?.(selectedFile);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setPreview(fileReader.result);
      }
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = '';
    onChange?.(null);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn('relative p-[3px] rounded-lg')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading && (
          <div
            className='absolute inset-0 rounded-lg pointer-events-none z-0'
            style={{
              background: `conic-gradient(var(--primary) ${progress * 3.6}deg, #e5e7eb ${progress * 3.6}deg)`,
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '3px',
            }}
          />
        )}

        <div
          className={cn(
            'relative z-10 border-2 border-dashed rounded-lg p-4 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25',
            error && 'border-destructive'
          )}
        >
          <Input
            ref={inputRef}
            id={id}
            name={name}
            type='file'
            accept={accept}
            onChange={handleFileChange}
            className='hidden'
          />

          {isUploading ? (
            <div className='flex flex-col items-center justify-center py-6'>
              <p className='mb-2 text-sm font-medium'>Uploading...</p>
              <p className='text-xs text-muted-foreground'>{progress}%</p>
            </div>
          ) : !file && !preview ? (
            <div className='flex flex-col items-center justify-center py-4 text-center'>
              <Upload className='w-8 h-8 mb-2 text-muted-foreground' />
              <p className='mb-1 text-sm font-medium'>
                Drag & drop your file here or
              </p>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                onClick={triggerFileInput}
                title='Browse files'
              >
                Browse files
              </Button>
              <p className='mt-2 text-xs text-muted-foreground'>
                {accept === 'image/*'
                  ? 'Supported formats: JPEG, PNG, GIF, etc.'
                  : ''}
                {maxSize ? ` (Max size: ${maxSize}MB)` : ''}
              </p>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              {preview ? (
                <div className='relative w-16 h-16 overflow-hidden rounded-md'>
                  <ImageSkeleton
                    src={preview}
                    alt='File preview'
                    className='object-cover w-full h-full'
                    width={64}
                    height={64}
                  />
                </div>
              ) : (
                <div className='flex items-center justify-center w-16 h-16 bg-muted rounded-md'>
                  {file?.type.startsWith('image/') ? (
                    <ImageIcon className='w-8 h-8 text-muted-foreground' />
                  ) : (
                    <FileIcon className='w-8 h-8 text-muted-foreground' />
                  )}
                </div>
              )}

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium break-all line-clamp-1'>
                  {file?.name || 'Preview'}
                </p>
                {file && (
                  <p className='text-xs text-muted-foreground'>
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                )}
              </div>

              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={clearFile}
                className='text-muted-foreground hover:text-foreground'
                title='X'
              />
            </div>
          )}
        </div>
      </div>

      {error && <p className='text-xs font-medium text-destructive'>{error}</p>}
    </div>
  );
}
