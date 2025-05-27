'use client';

import ProtectedWrapper from "@/components/auth/ProtectedWrapper";

export default function LocationsPage() {
  return (
    <ProtectedWrapper allowedRoles={["USER", "ADMIN"]}>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locations</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Welcome to the locations page. This page is accessible to all authenticated users.
            </p>
          </div>
        </div>
      </div>
    </ProtectedWrapper>
  );
} 