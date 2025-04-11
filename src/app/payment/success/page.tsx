import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for upgrading to HabitPulse Pro! You now have access to all premium features.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/habits"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 