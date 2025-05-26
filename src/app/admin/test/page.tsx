'use client';

import { useSession } from 'next-auth/react';

export default function AdminTestPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Admin Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-green-100 text-green-800 p-4 rounded">
          ✅ If you can see this page, you have admin access!
        </div>
      </div>
    </div>
  );
} 