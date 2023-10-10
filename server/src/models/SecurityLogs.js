import mongoose from "mongoose";

const SecurityLogSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
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
    type: String,
    required: true,
  },
});

export const SecurityLogModel = mongoose.model(
  "security_logs",
  SecurityLogSchema
);
