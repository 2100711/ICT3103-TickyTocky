import express from "express";
const certRouter = express.Router();
import {
    createCert,
    createCerts, // Import the batchCreateCertificates function
    getAllCerts,
    getCert,
    updateCert,
    deleteCert,
} from "../controls/certs.js";

certRouter.post("/create-cert", createCert); // Create a single certificate
certRouter.post("/create-certs", createCerts); // Batch create certificates
certRouter.get("/all-certs", getAllCerts); // Get all certificates
certRouter.get("/:certID", getCert); // Get one certificate by ID
certRouter.put("/:certID", updateCert); // Update a certificate by ID
certRouter.delete("/:certID", deleteCert); // Delete a certificate by ID

export { certRouter };