"use client"
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { signIn, useSession } from 'next-auth/react';

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
        signIn();
        return;
      }

      // Check if user is already Pro
      if (session.user?.isPro) {
        toast({
          title: "Already a Pro User",
          description: "You're already enjoying HabitPulse Pro! No need to purchase again.",
          variant: "default",
          className: "bg-blue-500 text-white border-none",
        });
        setIsLoading(false);
        return;
      }

      // Create PayPal order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'pro',
          userId: session.user.id
        }),
      });

      const data = await response.json();

      if (data.error === 'Already purchased') {
        toast({
          title: "Already Purchased",
          description: data.message,
          variant: "default",
          className: "bg-blue-500 text-white border-none",
        });
        router.push('/habits');
        return;
      }

      if (data.url) {
        // Redirect to PayPal checkout
        router.push(data.url);
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Choose Your Plan
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="rounded-lg p-8 border  ">
          <h3 className="text-xl font-semibold  mb-4">Free</h3>
          <p className="text-3xl font-bold  mb-6">$0<span className="text-lg font-normal ">/forever</span></p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Up to 3 habits</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Basic statistics</span>
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
          <p className="text-3xl font-bold  mb-6">$2<span className="text-lg font-normal ">/one-time</span></p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Unlimited habits</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Basic statistics</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Unlimited Journal Entries</span>
            </li>
            {/* <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Full history access</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Custom categories</span>
            </li>
            <li className="flex items-center ">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Priority support</span>
            </li> */}
          </ul>

          <Button 
            className="w-full"
            onClick={handleUpgradeClick}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : session?.user?.isPro ? "Already Pro" : "Upgrade to Pro"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 