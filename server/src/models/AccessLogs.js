import mongoose from "mongoose";
import { UserModel } from "./Users.js";

const AccessLogSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    maxlength: 255,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
    // required: true,
  },
  user_agent: {
    type: String,
    maxlength: 255,
    required: true,
  },
  http_status_codes: {
    type: Number,
    required: true,
  },
  requested_url: {
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

export const AccessLogModel = mongoose.model("access_logs", AccessLogSchema);
