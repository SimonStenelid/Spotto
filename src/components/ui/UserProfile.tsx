"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProfilePictureUpload } from './ProfilePictureUpload';

interface UserProfileProps {
  isCollapsed: boolean;
}

export function UserProfile({ isCollapsed }: UserProfileProps) {
  const { user } = useAuthStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  if (!user) {
    return (
      <Link
        to="/login"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isCollapsed && "justify-center"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">Sign in</span>
            <span className="text-xs text-gray-500">to save places</span>
          </div>
        )}
      </Link>
    );
  }

  return (
    <div className="relative">
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 w-full",
              isCollapsed && "justify-center"
            )}
          >
            <div className="relative w-8 h-8 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-purple-700">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-gray-900">{user.username}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            )}
          </button>
        </DialogTrigger>
        <DialogContent>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">Update Profile Picture</h2>
              <p className="text-sm text-gray-500">Upload a new profile picture</p>
            </div>
            <ProfilePictureUpload onClose={() => setIsUploadOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 