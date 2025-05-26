'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Center of Bermuda
const center = {
  lat: 32.3078,
  lng: -64.7505
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  mapTypeId: 'roadmap',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const libraries = ['places'];

export default function Map() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch locations');
      }

      setLocations(data.locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
      console.error('Error fetching locations:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Set bounds to cover all of Bermuda
    const bounds = new window.google.maps.LatLngBounds(
      { lat: 32.2470, lng: -64.8867 }, // Southwest corner
      { lat: 32.3909, lng: -64.6417 }  // Northeast corner
    );
    map.fitBounds(bounds);
    
    // Add a small padding to ensure the entire island is visible
    const currentZoom = map.getZoom();
    if (currentZoom) {
      map.setZoom(currentZoom - 0.5);
    }
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-red-500">Error loading maps</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    >
      {locations.map((location) => (
        <MarkerF
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          onClick={() => setSelectedLocation(location)}
          icon={{
            url: `/markers/${location.category.toLowerCase()}.svg`,
            scaledSize: new window.google.maps.Size(32, 32)
          }}
        />
      ))}

      {selectedLocation && (
        <InfoWindowF
          position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-1">{selectedLocation.name}</h3>
            {selectedLocation.images.length > 0 && (
              <div className="relative h-32 w-full mb-2">
                <img
                  src={selectedLocation.images[0]}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
            <p className="text-xs text-gray-500">{selectedLocation.address}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
} 