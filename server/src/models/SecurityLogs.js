import mongoose from "mongoose";

const SecurityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  login_attempts: {
    type: Number,
    required: true,
  },
  ip_address: {
    type: String,
    maxlength: 255,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const SecurityLogModel = mongoose.model(
  "security_logs",
  SecurityLogSchema
);
