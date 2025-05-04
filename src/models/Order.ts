// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  razorpayOrderId: String,
  amount: Number,          // in paise
  status: {                // 'created' | 'paid' | 'failed'
    type: String,
    default: 'created',
  },
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
