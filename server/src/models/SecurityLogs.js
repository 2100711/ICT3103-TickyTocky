import mongoose from "mongoose";

// Define the schema for security log entries
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

// Create the SecurityLogModel using the schema
export const SecurityLogModel = mongoose.model(
  "security_logs",
  SecurityLogSchema
);
