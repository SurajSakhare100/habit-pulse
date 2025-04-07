import mongoose, { Schema, model, models } from "mongoose";

const verifyTokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

verifyTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default models.VerifyToken || model("VerifyToken", verifyTokenSchema);
