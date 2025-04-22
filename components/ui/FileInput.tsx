"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Upload, X, FileIcon, ImageIcon } from "lucide-react";
import InputLabel from "./input-label";
import Image from "next/image";
import { useForm } from "react-hook-form";

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
  label = "Upload file",
  accept = "image/*",
  maxSize = 5, // 5MB default
  className,
  onChange,
  previewUrl,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    // Reset states
    setError(null);

    // If no file is selected (user canceled)
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      onChange?.(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Set the file
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Call onChange callback
    onChange?.(selectedFile);
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
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          error && "border-destructive"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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

        {!file && !preview ? (
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
            />
            <p className='mt-2 text-xs text-muted-foreground'>
              {accept === "image/*"
                ? "Supported formats: JPEG, PNG, GIF, etc."
                : ""}
              {maxSize ? ` (Max size: ${maxSize}MB)` : ""}
            </p>
          </div>
        ) : (
          <div className='flex items-center gap-4'>
            {preview ? (
              <div className='relative w-16 h-16 overflow-hidden rounded-md'>
                <Image
                  src={preview || "/placeholder.svg"}
                  alt='File preview'
                  className='object-cover w-full h-full'
                  width={64}
                  height={64}
                />
              </div>
            ) : (
              <div className='flex items-center justify-center w-16 h-16 bg-muted rounded-md'>
                {file?.type.startsWith("image/") ? (
                  <ImageIcon className='w-8 h-8 text-muted-foreground' />
                ) : (
                  <FileIcon className='w-8 h-8 text-muted-foreground' />
                )}
              </div>
            )}

            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium break-all line-clamp-1'>
                {file?.name || "Preview"}
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

      {error && <p className='text-xs font-medium text-destructive'>{error}</p>}
    </div>
  );
}
