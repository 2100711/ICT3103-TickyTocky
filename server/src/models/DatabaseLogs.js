import mongoose from "mongoose";

const DatabaseLogSchema = new mongoose.Schema({
  certificate_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
  },
  query_type: {
    type: String,
    maxlength: 255,
    required: true,
  },
});

export const DatabaseLogModel = mongoose.model(
  "database_logs",
  DatabaseLogSchema
);
