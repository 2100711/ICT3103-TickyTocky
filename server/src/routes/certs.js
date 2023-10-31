import express from "express";
const certRouter = express.Router();
import {
  createCert,
  createCerts, // Import the batchCreateCertificates function
  getAllCerts,
  getCert,
  getCertsByEmail,
  transferOwnershipCert,
  updateCert,
  deleteCert,
} from "../controls/certs.js";
import {
  validateCert,
  validateTransferOwnership,
} from "../controls/validation.js";
import { isAuthenticated, isAdmin } from "../controls/auth.js";
// import { logRequest } from "../controls/accessLogs.js";
import { logRequest } from "../controls/databaseLogs.js";

certRouter.post(
  "/create-cert",
  isAuthenticated,
  isAdmin,
  validateCert,
  createCert,
  logRequest
); // Create a single certificate
certRouter.post(
  "/create-certs",
  isAuthenticated,
  isAdmin,
  validateCert,
  createCerts,
  logRequest
); // TODO: Batch create certificates
certRouter.get("/all-certs", getAllCerts, logRequest); // Get all certificates
certRouter.get("/:certID", getCert, logRequest); // Get one certificate by ID
certRouter.post("/email", isAuthenticated, getCertsByEmail, logRequest);
certRouter.put(
  "/transfer-ownership",
  isAuthenticated,
  validateTransferOwnership,
  transferOwnershipCert,
  logRequest
);
certRouter.put("/", isAuthenticated, isAdmin, updateCert, logRequest); // Update a certificate by ID
certRouter.delete("/", isAuthenticated, isAdmin, deleteCert, logRequest); // Delete a certificate by ID

export { certRouter };
