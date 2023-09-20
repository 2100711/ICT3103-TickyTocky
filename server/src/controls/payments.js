import { PaymentsModel } from "../models/Payments.js";

// Create a new Payment
const createPayment = async (req, res) => {
  console.log("Creating Payment...", req.body);
  try {
    const payment = new PaymentsModel(req.body);
    console.log(payment);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create Payment' });
  }
};

// Read all Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentsModel.find();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Payments' });
  }
};

// Read a specific Payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentsModel.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Payment' });
  }
};

// Update a specific Payment by ID
const updatePaymentById = async (req, res) => {
  try {
    const payment = await PaymentsModel.findOneAndUpdate({paymentId: req.params.paymentId}, req.body, {
      new: true, // Return the updated document
    });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update Payment' });
  }
};

// Delete a specific Payment by ID
const deletePaymentById = async (req, res) => {
  try {
    const payment = await PaymentsModel.deleteOne({paymentId: req.params.paymentId});
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Payment' });
  }
};

export { createPayment, getAllPayments, getPaymentById, updatePaymentById, deletePaymentById }