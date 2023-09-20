const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    primary: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  card: {
    brand: String,
    panLastFour: String,
    expirationMonth: String,
    expirationYear: String,
    cvvVerified: Boolean,
  },
  token: String,
});

export const Payments = mongoose.model('Payments', paymentSchema);
