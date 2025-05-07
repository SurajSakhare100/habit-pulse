// app/api/payment/create-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PRICE = 99.00;    // in INR
const CURRENCY = 'INR';

const cleanupStalePayments = async (userId: string) => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  await Order.deleteMany({
    userId,
    status: 'PENDING',
    createdAt: { $lt: fifteenMinutesAgo },
  });
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await cleanupStalePayments(user._id);

    if (user.isPro) {
      const done = await Order.findOne({
        userId: user._id,
        status: 'COMPLETED',
      });
      if (done) {
        return NextResponse.json({
          error: 'Already purchased',
          message: 'You already have Pro access.',
          purchaseDate: done.createdAt,
        }, { status: 400 });
      }
    }
    const pending = await Order.findOne({
      userId: user._id,
      status: 'PENDING',
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) },
    });
    if (pending) {
      return NextResponse.json({ error: 'Pending payment exists' }, { status: 400 });
    }

    const options = {
      amount: Math.round(PRICE * 100),  // ₹ ×100 = paise
      currency: CURRENCY,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);

    await Order.create({
      userId:       user._id,
      razorpayOrderId: order.id,
      amount:       PRICE,
      currency:     CURRENCY,
      status:       'PENDING',
    });

    return NextResponse.json({
      orderId: order.id,
      amount:  order.amount,
      currency: order.currency,
      key:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
