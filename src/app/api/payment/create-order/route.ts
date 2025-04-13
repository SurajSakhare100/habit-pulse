import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import paypal from '@paypal/checkout-server-sdk';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';

// PayPal client configuration
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const PRICE = 5.00;
const CURRENCY = 'USD';

// Function to clean up stale pending payments
const cleanupStalePayments = async (userId: string) => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  await Payment.deleteMany({
    userId,
    status: 'PENDING',
    createdAt: { $lt: fifteenMinutesAgo }
  });
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Check if user exists and isn't already Pro
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Clean up stale pending payments
    await cleanupStalePayments(user._id);

    // Check if user is already Pro
    if (user.isPro) {
      // Check if they have a completed payment
      const completedPayment = await Payment.findOne({
        userId: user._id,
        status: 'COMPLETED'
      });

      if (completedPayment) {
        return NextResponse.json({ 
          error: 'Already purchased', 
          message: 'You have already purchased HabitPulse Pro!',
          purchaseDate: completedPayment.createdAt
        }, { status: 400 });
      }
    }

    // Check for pending payments
    const pendingPayment = await Payment.findOne({
      userId: user._id,
      status: 'PENDING',
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
    });

    if (pendingPayment) {
      return NextResponse.json({ error: 'Pending payment exists' }, { status: 400 });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: CURRENCY,
          value: PRICE.toFixed(2)
        },
        description: 'HabitPulse Pro Upgrade'
      }],
      application_context: {
        brand_name: 'HabitPulse',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/capture-order`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`
      }
    });

    const order = await client.execute(request);
    
    // Find the approval URL
    const approvalUrl = order.result.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href;
    const orderId = order.result.id;

    if (!approvalUrl || !orderId) {
      throw new Error('Invalid PayPal order response');
    }

    // Create pending payment record
    await Payment.create({
      userId: user._id,
      paypalOrderId: orderId,
      amount: PRICE,
      currency: CURRENCY,
      status: 'PENDING'
    });

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
} 