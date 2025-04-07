'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle credentials login (email/password)
  const handleCredentialsLogin = async () => {
    setLoading(true);
    setMessage('');

    // Attempt to sign in with credentials provider
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    // Handle response
    if (res?.ok) {
      router.push('/');  // Redirect to home page on successful login
    } else {
      setMessage(res?.error || 'Invalid credentials or unverified email');
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });  // Redirect to home page after Google login
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-sm w-full space-y-6 shadow-lg rounded-lg ">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold ">Sign In</h1>
          <p className="text-muted-foreground text-sm">Welcome back. Please sign in to continue.</p>
        </div>

        {/* Display error messages */}
        {message && <p className="text-red-500 text-sm text-center">{message}</p>}
        {error && !message && (
          <p className="text-red-500 text-sm text-center">
            {decodeURIComponent(error)}
          </p>
        )}

        {/* Email and Password Input */}
        <div className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button
            className="w-full"
            onClick={handleCredentialsLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>

        {/* Divider */}
          {/* <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div> */}
          <div className="relative flex justify-center text-xs uppercase">
            <span className=" px-4 text-muted-foreground">Or continue with</span>
          </div>

        {/* Google Sign In Button */}
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>

        {/* Sign up link */}
        <div className="text-sm text-center  pt-4">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="underline text-blue-600">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
