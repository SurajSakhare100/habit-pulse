// app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-center max-w-md mb-6">
        Oops! The page you're looking for doesn't exist. Maybe it was a bad habit? 😅
      </p>
      <Link href="/">
        <div className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Go Back Home
        </div>
      </Link>
    </div>
  );
}
