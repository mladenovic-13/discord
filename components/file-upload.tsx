'use client';

import { type FileRouterEndpoints } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

import '@uploadthing/react/styles.css';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: FileRouterEndpoints;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf')
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={value}
          alt='Upload'
          className='rounded-full object-cover'
        />
        <button className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'>
          <XIcon className='h-4 w-4' onClick={() => onChange('')} />
        </button>
      </div>
    );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error) => console.log(error)}
    />
  );
};
