import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import paypal from '@paypal/checkout-server-sdk';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';

// PayPal client configuration
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const EXPECTED_AMOUNT = 5.00;
const EXPECTED_CURRENCY = 'USD';

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  
  try {
    if (!session?.user?.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/signin?error=Unauthorized`);
    }

    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?error=missing-token`);
    }

    await dbConnect();
    
    // Find user first to get their ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?error=user-not-found`);
    }

    // Check if user is already Pro and has a completed payment
    if (user.isPro) {
      const completedPayment = await Payment.findOne({
        userId: user._id,
        status: 'COMPLETED'
      });

      if (completedPayment) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=already-purchased&date=${completedPayment.createdAt.toISOString()}`);
      }
    }

    // Check if payment was already processed
    const existingPayment = await Payment.findOne({
      paypalOrderId: token,
      status: 'COMPLETED'
    });

    if (existingPayment) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/success?warning=already-processed`);
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);
    const capture = await client.execute(request);

    // Verify payment details
    const captureAmount = capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    if (!captureAmount) {
      throw new Error('Invalid capture response');
    }

    // Verify payment amount and currency
    if (parseFloat(captureAmount.value) !== EXPECTED_AMOUNT || 
        captureAmount.currency_code !== EXPECTED_CURRENCY) {
      throw new Error('Payment amount or currency mismatch');
    }

    if (capture.result.status === 'COMPLETED') {
      // Update pending payment or create new one
      await Payment.findOneAndUpdate(
        { paypalOrderId: token },
        {
          userId: user._id,
          paypalOrderId: token,
          amount: EXPECTED_AMOUNT,
          currency: EXPECTED_CURRENCY,
          status: 'COMPLETED'
        },
        { upsert: true }
      );

      // Update user subscription status with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          await User.findOneAndUpdate(
            { _id: user._id, isPro: false }, // Only update if not already Pro
            { 
              $set: { 
                isPro: true,
                proSince: new Date()
              }
            },
            { new: true }
          );
          break;
        } catch (updateError) {
          retries--;
          if (retries === 0) throw updateError;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/success`);
    } else {
      // Update or create payment record for failed payment
      await Payment.findOneAndUpdate(
        { paypalOrderId: token },
        {
          userId: user._id,
          paypalOrderId: token,
          amount: EXPECTED_AMOUNT,
          currency: EXPECTED_CURRENCY,
          status: 'FAILED'
        },
        { upsert: true }
      );

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?error=payment-failed`);
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    
    // If we have the user session and token, record the failed payment
    if (session?.user?.email && searchParams.get('token')) {
      try {
        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          await Payment.findOneAndUpdate(
            { paypalOrderId: searchParams.get('token')! },
            {
              userId: user._id,
              paypalOrderId: searchParams.get('token')!,
              amount: EXPECTED_AMOUNT,
              currency: EXPECTED_CURRENCY,
              status: 'FAILED'
            },
            { upsert: true }
          );
        }
      } catch (dbError) {
        console.error('Failed to record payment error:', dbError);
      }
    }
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?error=system-error`);
  }
}
