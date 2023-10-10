import mongoose from "mongoose";

const AccessLogSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    maxlength: 255,
    required: false, // TODO: get from nginx?
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
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
    type: String,
    required: true,
  },
});

export const AccessLogModel = mongoose.model("access_logs", AccessLogSchema);