'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

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
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });  // Redirect to home page after Google login
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-sm w-full space-y-2">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p>Start tracking your daily habits today</p>
        </div>

        {/* Name Input */}
        <div className="">
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
          className="w-full  mt-4 font-semibold "
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        <div className=" flex justify-center text-xs uppercase">
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
