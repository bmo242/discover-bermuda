'use client';

import ProtectedWrapper from "@/components/auth/ProtectedWrapper";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(session?.user?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await uploadResponse.json();
      return data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image
      const imageUrl = await handleImageUpload(file);
      setImagePreview(imageUrl);
      
      // Update the profile with the new image URL
      await handleSubmit(undefined, imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setImagePreview(session?.user?.image || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, imageUrl?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          ...(imageUrl && { image: imageUrl }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update the session to reflect the changes
      await updateSession();
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedWrapper allowedRoles={["USER", "ADMIN"]}>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setError('');
                    setSuccessMessage('');
                    if (!isEditing) {
                      setName(session?.user?.name || '');
                      setImagePreview(session?.user?.image || '');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600">{successMessage}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl text-gray-500">
                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <>
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <span className="text-white text-sm">Change Photo</span>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isLoading}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1">
                        <input
                          type="email"
                          disabled
                          value={session?.user?.email || ''}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing || isLoading}
                          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                            isEditing && !isLoading ? 'bg-white' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled
                          value={session?.user?.role || ''}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e)}
                      disabled={isLoading}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedWrapper>
  );
} 