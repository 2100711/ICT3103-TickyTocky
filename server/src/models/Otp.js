import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  token: {
    type: Number,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
});
OtpSchema.path("timestamps").index({ expires: 15 });
export const OtpModel = mongoose.model("otp", OtpSchema);
