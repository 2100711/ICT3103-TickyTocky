import { CertModel } from "../models/Certs.js";
import XLSX from "xlsx";
import {
  createWatch,
  getAllWatches,
  getWatch,
  updateWatch,
  deleteWatch,
} from "../controls/watches.js";

// Create a new cert
const createCert = async (req, res) => {
  console.log(req.body);
  try {
    const {
      user_email,
      validated_by,
      date_of_validation,
      issue_date,
      expiry_date,
      remarks,
      brand,
      model_no,
      model_name,
      movement,
      case_material,
      bracelet_strap_material,
      yop,
      gender,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    } = req.body;

    const watch = {
      brand,
      model_no,
      model_name,
      movement,
      case_material,
      bracelet_strap_material,
      yop,
      gender,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    };
    const watch_id = await createWatch(watch);
    const cert = new CertModel({
      user_email,
      validated_by,
      date_of_validation,
      watch_id,
      issue_date,
      expiry_date,
      remarks,
    });

    await cert.save();

    res.status(201).json({
      success: true,
      message: "Certificate created",
      cert,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Batch create certs
const createCerts = async (req, res) => {
  try {
    const { file } = req;

    if (!file || !file.buffer) {
      return res.status(400).json({ message: "File not provided or invalid" });
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const certDataArray = XLSX.utils.sheet_to_json(worksheet);

    const certs = await CertModel.insertMany(certDataArray);

    res.status(201).json({
      message: "Certificates created successfully",
      certs,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating certificates" });
  }
};

// Get all certs
const getAllCerts = async (req, res) => {
  try {
    const certs = await CertModel.find();
    res.status(200).json({
      success: true,
      message: "All certificates retrieved",
      certs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Get a cert by ID
const getCert = async (req, res) => {
  try {
    const { _id } = req.params;
    const cert = await CertModel.findById(_id);

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({ cert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Update a cert by ID
const updateCert = async (req, res) => {
  try {
    const {
      _id,
      validated_by,
      date_of_validation,
      issue_date,
      expiry_date,
      remarks,
    } = req.body;
    const query = { _id };
    const update = {
      validated_by,
      date_of_validation,
      issue_date,
      expiry_date,
      remarks,
    };

    const updatedCert = await CertModel.findOneAndUpdate(query, update, {
      new: true,
    });

    if (!updatedCert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      message: "Certificate updated",
      updatedCert,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Delete a cert by ID
const deleteCert = async (req, res) => {
  try {
    const { _id } = req.body;
    const deletedCert = await CertModel.findByIdAndRemove(_id);

    if (!deletedCert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      message: "Certificate deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export {
  createCert,
  createCerts,
  getAllCerts,
  getCert,
  updateCert,
  deleteCert,
};
