'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  endpoint: 'avatarUploader' | 'mediaUploader';
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ImageUploader({
  onUploadComplete,
  endpoint,
  accept = 'image/*',
  className,
  children,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/uploadthing?actionType=upload&slug=${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.url) {
          onUploadComplete(data[0].url);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={className}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : children ? (
          children
        ) : (
          <Upload className="w-4 h-4" />
        )}
      </button>
    </>
  );
}
