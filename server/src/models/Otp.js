import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  is_used : {
    type: Boolean,
  default: false,
    required: true,
  }
});
OtpSchema.path("timestamps").index({ expires: 600 });

export const OtpModel = mongoose.model("otp", OtpSchema);
