import express from "express";
const certRouter = express.Router();
import {
  createCert,
  createCerts, // Import the batchCreateCertificates function
  getAllCerts,
  getCert,
  transferOwnershipCert,
  updateCert,
  deleteCert,
} from "../controls/certs.js";

import { isAuthenticated, isAdmin } from "../controls/auth.js";

certRouter.post("/create-cert", isAuthenticated, isAdmin, createCert); // Create a single certificate
certRouter.post("/create-certs", createCerts); // TODO: Batch create certificates
certRouter.get("/all-certs", getAllCerts); // Get all certificates
certRouter.get("/:certID", getCert); // Get one certificate by ID
certRouter.put("/transfer-ownership", isAuthenticated, transferOwnershipCert);
certRouter.put("/", isAuthenticated, isAdmin, updateCert); // Update a certificate by ID
certRouter.delete("/", isAuthenticated, isAdmin, deleteCert); // Delete a certificate by ID

export { certRouter };
