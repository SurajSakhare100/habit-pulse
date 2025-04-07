'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage('✅ Please verify your email to continue');
    } else {
      setMessage(`❌ ${data.error || 'Something went wrong'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-sm w-full space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p>Start tracking your daily habits today</p>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium ">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className=""
            required
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium ">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className=""
            required
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium ">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className=""
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full py-3 mt-4 font-semibold "
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>

        {/* Feedback Message */}
        {message && (
          <p className={`text-sm text-center mt-3 ${message.includes('❌') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        {/* Sign-in Link */}
        <div className="text-sm text-center  mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="underline text-blue-500 hover:text-blue-600">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
