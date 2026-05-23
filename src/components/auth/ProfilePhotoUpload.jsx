import React from 'react';
import { Camera } from 'lucide-react';

/**
 * ProfilePhotoUpload Component
 * Handles profile photo upload with preview
 */
const ProfilePhotoUpload = ({ profilePhoto, onPhotoUpload, className = '' }) => {
  return (
    <div className={className}>
      <label className="mb-3 block text-sm font-medium text-gray-700">Profile Photo</label>
      <div className="relative inline-block">
        {/* Photo Preview */}
        <div className="h-20 w-20 overflow-hidden rounded-full bg-blue-100">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <label
          htmlFor="photo-upload"
          className="absolute right-0 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white shadow-md hover:bg-gray-50"
        >
          <Camera className="h-4 w-4 text-gray-600" />
        </label>

        {/* Hidden File Input */}
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={onPhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
