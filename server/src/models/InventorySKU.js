const mongoose = require('mongoose');

const inventorySKUSchema = new mongoose.Schema({
  skuID: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  referenceNo: {
    type: String,
    required: true,
  },
  movement: {
    type: String,
    required: true,
  },
  caseMaterial: String,
  braceletMaterial: String,
  yop: Date,
  gender: String,
  price: {
    type: Number,
    required: true,
  },
  rating: Number,
  ratingCount: Number,
  category: {
    type: String,
    required: true,
  },
});

export const InventorySKU = mongoose.model('inventorySKU', inventorySKUSchema);