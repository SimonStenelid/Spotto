"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { updateAvatar } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from "./button";
import { cn } from "../../lib/utils";
import { Loader2 } from 'lucide-react';
import { useToast } from "./use-toast";
import { supabase } from '../../lib/supabase';

interface ProfilePictureUploadProps {
  onClose?: () => void;
}

export function ProfilePictureUpload({ onClose }: ProfilePictureUploadProps) {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) {
      toast({
        title: "Error",
        description: "No file selected or user not logged in.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size too large. Maximum size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Only image files are allowed.",
        variant: "destructive"
      });
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

      console.log('Starting file upload process...', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId: user.id
      });

      // Use the updateAvatar helper function
      const { error, publicUrl } = await updateAvatar(user.id, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        console.error('Error uploading avatar:', error);
        let errorMessage = 'Failed to update profile picture. ';
        if (error instanceof Error) {
          errorMessage += error.message;
        } else if (typeof error === 'object' && error !== null) {
          // Handle Supabase error object
          const supabaseError = error as { message?: string, details?: string };
          errorMessage += supabaseError.message || supabaseError.details || 'Unknown error occurred.';
        } else {
          errorMessage += 'Please try again.';
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (!publicUrl) {
        console.error('No public URL returned');
        toast({
          title: "Error",
          description: "No URL returned from upload. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully got public URL:', publicUrl);

      // Get the updated profile data
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile) throw new Error('No profile data returned');

        // Update the user in the store with all profile data
        const updatedUser = {
          ...user,
          avatar: profile.avatar,
          username: profile.username,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          city: profile.city,
          postalCode: profile.postal_code,
          country: profile.country,
          bookmarks: profile.bookmarks || [],
          visitedPlaces: profile.visited_places || [],
          updatedAt: profile.updated_at
        };

        updateUser(updatedUser);
        console.log('Profile updated successfully');
        toast({
          title: "Success",
          description: "Profile picture updated successfully!"
        });
        if (onClose) onClose();
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
        let errorMessage = 'Failed to update profile. ';
        if (profileError instanceof Error) {
          errorMessage += profileError.message;
        } else if (typeof profileError === 'object' && profileError !== null) {
          const supabaseError = profileError as { message?: string, details?: string };
          errorMessage += supabaseError.message || supabaseError.details || 'Unknown error occurred.';
        } else {
          errorMessage += 'Please try again.';
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      let errorMessage = 'An unexpected error occurred. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === 'object' && error !== null) {
        const supabaseError = error as { message?: string, details?: string };
        errorMessage += supabaseError.message || supabaseError.details || 'Please try again.';
      } else {
        errorMessage += 'Please try again.';
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  }, [user, updateUser, toast, onClose]);

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