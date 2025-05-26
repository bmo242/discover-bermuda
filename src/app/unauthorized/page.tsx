import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
          <p className="text-gray-600 mb-8">
            Sorry, you don't have permission to access this page.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 