'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

enum LocationCategory {
  BEACH = 'BEACH',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  ATTRACTION = 'ATTRACTION',
  SHOPPING = 'SHOPPING',
  NIGHTLIFE = 'NIGHTLIFE',
  PARK = 'PARK',
  HISTORIC_SITE = 'HISTORIC_SITE',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER'
}

interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  category: LocationCategory;
  createdAt: Date;
  updatedAt: Date;
}

interface LocationFormProps {
  location?: Location;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function LocationForm({ location, onSubmit, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    address: location?.address || '',
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    category: location?.category || LocationCategory.OTHER,
    images: location?.images || []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(location?.images || []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Upload images first
      const uploadedImageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const data = await response.json();
          return data.secure_url;
        })
      );

      // Combine existing images (that weren't removed) with new uploaded ones
      const finalImages = [
        ...previewUrls.filter(url => !url.startsWith('blob:')),
        ...uploadedImageUrls
      ];

      await onSubmit({
        ...formData,
        images: finalImages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as LocationCategory }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        >
          {Object.values(LocationCategory).map((category) => (
            <option key={category} value={category}>
              {category.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            required
            value={formData.latitude}
            onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            required
            value={formData.longitude}
            onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {previewUrls.map((url, index) => (
            <div key={`image-${index}`} className="relative group aspect-square">
              <div className="relative h-full w-full rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Location image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <label className="relative block aspect-square cursor-pointer">
            <div className="h-full w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
        </button>
      </div>
    </form>
  );
} 