'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LocationForm from './LocationForm';

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

export default function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<LocationCategory | 'ALL'>('ALL');

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch locations');
      }

      setLocations(data.locations);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create location');
      }

      setIsCreating(false);
      fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedLocation) return;

    try {
      const response = await fetch(`/api/admin/locations/${selectedLocation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update location');
      }

      setSelectedLocation(null);
      fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (locationId: string) => {
    try {
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete location');
      }

      fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isCreating || selectedLocation) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {isCreating ? 'Create New Location' : 'Edit Location'}
            </h3>
          </div>
          <LocationForm
            location={selectedLocation || undefined}
            onSubmit={isCreating ? handleCreate : handleUpdate}
            onCancel={() => {
              setIsCreating(false);
              setSelectedLocation(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || location.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Locations</h3>
            <p className="mt-2 text-sm text-gray-700">
              A list of all locations in Bermuda including their details and status.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0">
            <button
              onClick={() => setIsCreating(true)}
              className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Add Location
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search" className="sr-only">
              Search locations
            </label>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Search locations..."
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as LocationCategory | 'ALL')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="ALL">All Categories</option>
              {Object.values(LocationCategory).map((category) => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Locations Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Address
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Images
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLocations.map((location) => (
                    <tr key={location.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {location.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {location.category.replace(/_/g, ' ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {location.address}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex -space-x-2">
                          {location.images.slice(0, 3).map((image, index) => (
                            <div key={`image-${location.id}-${index}`} className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white">
                              <Image
                                src={image}
                                alt={`${location.name} image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {location.images.length > 3 && (
                            <div className="relative h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center">
                              <span className="text-xs text-gray-500">+{location.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(location.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => setSelectedLocation(location)}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this location?')) {
                              handleDelete(location.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 