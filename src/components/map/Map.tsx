'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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
      zoom={11} // Default zoom level if bounds don't work
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    />
  );
} 