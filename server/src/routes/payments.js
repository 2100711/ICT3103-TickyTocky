import express from "express";
import { createPayment, getAllPayments, getPaymentById, updatePaymentById, deletePaymentById } from "../controls/payments.js";

const paymentsRouter = express.Router();
// Define your API routes
paymentsRouter.post('/payments', createPayment);
paymentsRouter.get('/payments', getAllPayments);
paymentsRouter.get('/payments/:paymentId', getPaymentById);
paymentsRouter.put('/payments/:paymentId', updatePaymentById);
paymentsRouter.delete('/payments/:paymentId', deletePaymentById);

export { paymentsRouter };
