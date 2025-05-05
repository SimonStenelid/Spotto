"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { updateAvatar } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  onClose?: () => void;
}

export function ProfilePictureUpload({ onClose }: ProfilePictureUploadProps) {
  const { user, updateProfile } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Use the updateAvatar helper function
      const { error, publicUrl } = await updateAvatar(user.id, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;
      if (!publicUrl) throw new Error('No public URL returned');

      // Update user profile in store
      await updateProfile({ avatar: publicUrl });
      
      toast.success('Profile picture updated successfully!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  }, [user, updateProfile, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <p className="text-sm text-gray-500">
              {isUploading ? 'Uploading...' : 'Click or drag to choose a different photo'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 mx-auto flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              ) : (
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">
                {isDragActive ? "Drop your photo here" : "Upload a new photo"}
              </p>
              <p className="text-sm text-gray-500">
                or click to select a file (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
} 