// app/api/payment/capture-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

const EXPECTED_AMOUNT = 99.00;
const EXPECTED_CURRENCY = 'INR';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false, error: 'Missing parameters' }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  // Verify HMAC signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const isValid = generatedSignature === razorpay_signature;

  // Upsert payment record
  const status = isValid ? 'COMPLETED' : 'FAILED';
  await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      userId: user._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: EXPECTED_AMOUNT,
      currency: EXPECTED_CURRENCY,
      status,
    },
    { upsert: true, new: true }
  );

  // Upgrade user if valid
  if (isValid) {
    await User.findOneAndUpdate(
      { _id: user._id, isPro: false },
      { isPro: true, proSince: new Date() }
    );
  }

  return NextResponse.json({ ok: isValid });
}