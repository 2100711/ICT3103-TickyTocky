import mongoose from "mongoose";

const SerialNumberSchema = new mongoose.Schema({
  case: {
    type: String,
    maxlength: 255,
    required: true,
  },
  movement: {
    type: String,
    maxlength: 255,
    required: true,
  },
  dial: {
    type: String,
    maxlength: 255,
    required: true,
  },
  bracelet_strap: {
    type: String,
    maxlength: 255,
  },
  crown_pusher: {
    type: String,
    maxlength: 255,
  },
});

export const SerialNumberModel = mongoose.model(
  "serial_numbers",
  SerialNumberSchema
);
