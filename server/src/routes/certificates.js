import express from "express";
const certificateRouter = express.Router();
import {
  createCertificate,
  getAllCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controls/certificates.js";

certificateRouter.post("/", createCertificate);
certificateRouter.get("/", getAllCertificates);
certificateRouter.get("/:certificateID", getCertificate); // get one user
certificateRouter.put("/", updateCertificate);
certificateRouter.delete("/", deleteCertificate);

export { certificateRouter };
