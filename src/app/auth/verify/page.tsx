'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('❌ Invalid or missing verification token.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const { status, data } = await axios.get('/api/auth/verify', {
          params: { token },
        });

        if (status === 200) {
          setStatus('success');
          setMessage('✅ Your email has been verified! Redirecting to sign in...');
          setTimeout(() => router.push('/auth/signin'), 3000);
        } else {
          setStatus('error');
          setMessage(`❌ ${data?.error || 'Invalid or expired verification link.'}`);
        }
      } catch (error: any) {
        setStatus('error');
        const errMsg = error?.response?.data?.error || 'Something went wrong. Please try again.';
        setMessage(`❌ ${errMsg}`);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="p-8 max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="text-muted-foreground text-sm">{message}</p>

        {status === 'error' && (
          <div className="pt-4">
            <Link href="/auth/signin">
              <Button className="w-full">Back to Sign In</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
