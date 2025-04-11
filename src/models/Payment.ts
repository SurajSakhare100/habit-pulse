import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paypalOrderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'CANCELLED', 'FAILED', 'PENDING'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment; 