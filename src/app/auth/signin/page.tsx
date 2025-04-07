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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.13 7.64 23 12 23z"/>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.64 1 4.01 3.87 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  <path fill="none" d="M1 1h22v22H1z"/>
</svg>
          <span>Sign in with Google</span>
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
