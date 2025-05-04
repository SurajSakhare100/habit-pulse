"use client"
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';

interface PricingProps {
  onUpgrade?: () => void;
}

const Pricing = ({ onUpgrade }: PricingProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    try {
      if (!session) {
        // If not logged in, redirect to sign in
        router.push('/auth/signin');
        return;
      }

      // Check if user is already Pro
      if (session.user?.isPro) {
        toast({
          title: 'Already a Pro User',
          description: "You're already enjoying HabitPulse Pro! No need to purchase again.",
          variant: 'default',
          className: 'bg-blue-500 text-white border-none',
        });
        return;
      }

      // Create Razorpay order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro', userId: session.user.id }),
      });
      const data = await res.json();

      if (data.error) {
        if (data.error === 'Already purchased') {
          toast({
            title: 'Already Purchased',
            description: data.message,
            variant: 'default',
            className: 'bg-blue-500 text-white border-none',
          });
          router.push('/habits');
          return;
        }
        if (data.error === 'Pending payment exists') {
          toast({
            title: 'Payment Pending',
            description: 'You have a pending payment. Please try again after 15 minutes.',
            variant: 'default',
            className: 'bg-yellow-500 text-white border-none',
          });
          return;
        }
        throw new Error(data.error);
      }

      const { orderId, amount, currency, key } = data;

      // Open Razorpay checkout
      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        handler: async (response: any) => {
          // Verify payment on server
          const verifyRes = await fetch('/api/payment/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const { ok } = await verifyRes.json();
          router.push(ok ? '/payment/success' : '/payment/cancelled');
        },
        modal: {
          ondismiss: () => router.push('/payment/cancelled'),
        },
      };
  
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to process upgrade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      if (onUpgrade) onUpgrade();
    }
  };

  return (
    <div className="w-full mx-auto px-4 my-20 max-w-5xl ">
      {/* Load Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="flex flex-col text-center w-full mb-20">
        <div className="mb-4 flex items-center justify-center ">
          <div className="w-fit  bg-blue-500 text-white px-3 py-1 rounded-full text-sm fade-in-up animate-fade-in-up">
            ✨ Launch discount — 90% Off ✨
          </div>
        </div>
        <h2 className="max-w-5xl font-bold text-2xl lg:text-4xl tracking-tight mb-8 mx-auto">
          Stop wasting time on ineffective routines
        </h2>
        <div className="text-base-content-secondary max-w-md mx-auto">
          Break free from bad habits, stay on track with your goals, and make progress every day.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 ">
        {/* Free Plan */}
        <div className="rounded-lg p-8 border  ">
          <h3 className="text-xl font-semibold  mb-4">Free</h3>
          <p className="text-3xl font-bold  mb-6">
            $0<span className="text-lg font-normal ">/forever</span>
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Up to 3 habits</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Up to 3 Journal Entries</span>
            </li>
          </ul>

          <Button
            className="w-full border-black"
            variant="outline"
            onClick={() => router.push('/habits')}
          >
            Get Started
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-lg p-8 border border-blue-500/50 relative">
          <div className="absolute -top-3 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Popular
          </div>

          <h3 className="text-xl font-semibold  mb-4">Pro</h3>

          <div className="flex flex-wrap items-end gap-2">
            <p className="text-lg text-base-content/80 line-through mb-2">$49</p>
            <p className="text-5xl font-extrabold tracking-tight ">$5</p>
            <p className="text-sm text-base-content/60 font-semibold">
              / Lifetime deal (yours forever)
            </p>
          </div>

          <ul className="space-y-4 mb-8 mt-4">
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Unlimited habits</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Unlimited Journal Entries</span>
            </li>
          </ul>

          <Button
            className="w-full"
            onClick={handleUpgradeClick}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : session?.user?.isPro ? 'Already Pro' : 'Upgrade to Pro'}
          </Button>

          <Badge className="flex items-center justify-center mt-4 bg-muted text-foreground text-xs">
            for indian users pro plan is currently not available 😞
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Pricing;