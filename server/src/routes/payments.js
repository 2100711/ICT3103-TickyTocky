import express from "express";
import { createPayment, getAllPayments, getPaymentById, updatePaymentById, deletePaymentById } from "../controls/payments.js";

const paymentsRouter = express.Router();
// Define your API routes
paymentsRouter.post('/', createPayment);
paymentsRouter.get('/', getAllPayments);
paymentsRouter.get('/:paymentId', getPaymentById);
paymentsRouter.put('/:paymentId', updatePaymentById);
paymentsRouter.delete('/:paymentId', deletePaymentById);

export { paymentsRouter };
