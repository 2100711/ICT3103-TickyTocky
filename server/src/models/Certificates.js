import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  brand: {
    type: String,
    maxlength: 255,
    required: true,
  },
  model_no: {
    type: String,
    maxlength: 255,
    required: true,
  },
  model_name: {
    type: String,
    maxlength: 255,
    required: true,
  },
  movement: {
    type: String,
    maxlength: 255,
    required: true,
  },
  case_material: {
    type: String,
    maxlength: 255,
    required: true,
  },
  bracelet_strap_material: {
    type: String,
    maxlength: 255,
    required: true,
  },
  yop: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    maxlength: 1,
    minlength: 1,
    required: true,
  },
  serial_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const CertificateModel = mongoose.model(
  "certificates",
  CertificateSchema
);
