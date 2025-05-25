'use client';

import dynamic from 'next/dynamic';

const MapWrapper = dynamic(() => import('../components/map/MapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <MapWrapper />
    </div>
  );
}
