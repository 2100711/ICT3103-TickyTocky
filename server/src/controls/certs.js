import { CertModel } from "../models/Certs.js";
import { UserModel } from "../models/Users.js";
import XLSX from "xlsx";
import {
  createWatch,
  getAllWatches,
  getWatch,
  updateWatch,
  deleteWatch,
} from "../controls/watches.js";
import { createAccessLog } from "../controls/accessLogs.js";
import { getUser } from "../controls/users.js";
import { userExists } from "../controls/auth.js";
import { createPdfContent, generatePdfContent } from "../controls/pdf.js";

const generateRandomCertId = () => {
  const getRandomLetter = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const getRandomDigit = () => String(Math.floor(Math.random() * 10));

  let result = "";
  for (let i = 0; i < 3; i++) {
    result += getRandomLetter();
  }
  for (let i = 0; i < 3; i++) {
    result += getRandomDigit();
  }

  return result;
};

const checkIfCertIdExists = async (alphanumeric) => {
  const result = await CertModel.findOne({ cert_id: alphanumeric });
  return result !== null;
};

const createCert = async (req, res) => {
  const session = await CertModel.startSession();
  try {
    session.startTransaction();

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

    const watch_id = await createWatch(watch, session);

    let randomCertId = generateRandomCertId(6);
    let certIdExists = await checkIfCertIdExists(randomCertId);
    while (certIdExists) {
      randomCertId = generateRandomCertId(6);
      certIdExists = await checkIfCertIdExists(randomCertId);
    }

    const pdfContent = await createPdfContent({
      cert_id: randomCertId,
      user_email,
      validated_by,
      date_of_validation,
      watch_id,
      issue_date,
      expiry_date,
      remarks,
    });

    const cert = new CertModel({
      cert_id: randomCertId,
      user_email,
      validated_by,
      date_of_validation,
      watch_id,
      issue_date,
      expiry_date,
      remarks,
      pdf_content: pdfContent,
    });

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    await cert.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Certificate created",
      cert,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const createCerts = async (req, res) => {
  const session = await CertModel.startSession();
  try {
    session.startTransaction();

    const certDataArray = req.body;
    const pdfContentsArray = [];

    for (const certData of certDataArray) {
      const watch = {
        brand: certData.brand,
        model_no: certData.model_no,
        model_name: certData.model_name,
        movement: certData.movement,
        case_material: certData.case_material,
        bracelet_strap_material: certData.bracelet_strap_material,
        yop: certData.yop,
        gender: certData.gender,
        case_serial: certData.case_serial,
        movement_serial: certData.movement_serial,
        dial: certData.dial,
        bracelet_strap: certData.bracelet_strap,
        crown_pusher: certData.crown_pusher,
      };

      const watch_id = await createWatch(watch, session);

      let randomCertId = generateRandomCertId(6);
      let certIdExists = await checkIfCertIdExists(randomCertId);
      while (certIdExists) {
        randomCertId = generateRandomCertId(6);
        certIdExists = await checkIfCertIdExists(randomCertId);
      }

      const pdfContent = await createPdfContent({
        cert_id: randomCertId,
        user_email: certData.user_email,
        validated_by: certData.validated_by,
        date_of_validation: certData.date_of_validation,
        watch_id,
        issue_date: certData.issue_date,
        expiry_date: certData.expiry_date,
        remarks: certData.remarks,
      });

      const certs = new CertModel({
        cert_id: randomCertId,
        user_email: certData.user_email,
        validated_by: certData.validated_by,
        date_of_validation: certData.date_of_validation,
        watch_id,
        issue_date: certData.issue_date,
        expiry_date: certData.expiry_date,
        remarks: certData.remarks,
        pdf_content: pdfContent,
      });

      pdfContentsArray.push(certs);
    }

    const certs = await CertModel.insertMany(pdfContentsArray);

    certs.forEach((cert, index) => {
      cert.pdf_content = pdfContentsArray[index];
    });

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Certificates created successfully",
      certs,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "An error occurred while creating certificates",
    });
  }
};

const getAllCerts = async (req, res) => {
  try {
    const certs = await CertModel.find({ pdf_content: { $ne: null } }).select(
      "-_id cert_id user_email pdf_content"
    );

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);
    res.status(200).json({
      success: true,
      message: "All certificates retrieved",
      certs: certs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getCert = async (req, res) => {
  try {
    const cert_id = req.params.certID;
    const cert = await CertModel.findOne(
      { cert_id: cert_id },
      { _id: 0 }
    ).populate({
      path: "watch_id",
      select: "-_id",
      populate: {
        path: "serial_id",
        select: "-_id",
      },
    });

    if (!cert) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    let isAdmin = {};
    if (req.session.user) {
      isAdmin = await UserModel.findOne({
        email: req.session.user.email,
      }).select("-_id role");
    }

    if (!req.session.user || req.session.user.email !== cert.user_email) {
      if (
        cert.watch_id &&
        cert.watch_id.serial_id &&
        isAdmin.role !== "admin"
      ) {
        cert.watch_id.serial_id.case_serial = "XXXXXX";
        cert.watch_id.serial_id.movement_serial = "XXXXXX";
        cert.watch_id.serial_id.dial = "XXXXXX";
        cert.watch_id.serial_id.bracelet_strap = "XXXXXX";
        cert.watch_id.serial_id.crown_pusher = "XXXXXX";
      }
    }

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    const pdf_content = await generatePdfContent(cert);

    res
      .status(200)
      .json({ success: true, message: "Certificate found", pdf_content });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const transferOwnershipCert = async (req, res) => {
  try {
    const { cert_id, current_email, next_email } = req.body;

    if (current_email === next_email)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    const cert = await CertModel.findOne({ cert_id });

    if (!cert)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    if (
      cert.user_email !== current_email ||
      cert.user_email !== req.session.user.email
    )
      return res.status(401).json({ success: false, message: "Unauthorized." });

    const query = { cert_id: cert_id };

    let randomCertId = generateRandomCertId(6);
    let certIdExists = await checkIfCertIdExists(randomCertId);
    while (certIdExists) {
      randomCertId = generateRandomCertId(6);
      certIdExists = await checkIfCertIdExists(randomCertId);
    }

    const update = {
      cert_id: randomCertId,
      user_email: next_email,
    };

    const updatedCert = await CertModel.findOneAndUpdate(query, update, {
      new: true,
      select: "-_id -watch_id",
    });

    if (!updatedCert) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    res.status(200).json({
      success: true,
      message: "Certificate updated",
      cert: updatedCert,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const updateCert = async (req, res) => {
  const session = await CertModel.startSession();
  try {
    const {
      cert_id,
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

    const cert = await CertModel.findOne({ cert_id: cert_id });

    if (!cert)
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found." });

    const user_exist = await userExists(user_email);
    if (!user_exist)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const watch = {
      watch_id: cert.watch_id,
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

    const session = await CertModel.startSession();
    session.startTransaction();

    const watch_id = await updateWatch(watch, session);

    const query = { cert_id: cert_id };

    const update = {
      user_email,
      validated_by,
      date_of_validation,
      issue_date,
      expiry_date,
      remarks,
    };

    const updatedCert = await CertModel.findOneAndUpdate(query, update, {
      new: true,
      session,
      select: "-_id",
    });

    if (!updatedCert) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    await session.commitTransaction();
    session.endSession();

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    res.status(200).json({
      success: true,
      message: "Certificate updated",
      updatedCert,
    });
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const deleteCert = async (req, res) => {
  const session = await CertModel.startSession();
  try {
    const { cert_id } = req.body;

    const cert = await CertModel.findOne({ cert_id: cert_id });

    if (!cert)
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });

    session.startTransaction();

    const deletedWatch = await deleteWatch(cert.watch_id, session);

    const deletedCert = await CertModel.findOneAndDelete(
      { cert_id: cert_id },
      { session }
    );

    if (!deletedCert) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    await session.commitTransaction();
    session.endSession();

    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: req.session.user.email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user._id,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    res.status(200).json({
      success: true,
      message: "Certificate deleted",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export {
  createCert,
  createCerts,
  getAllCerts,
  getCert,
  transferOwnershipCert,
  updateCert,
  deleteCert,
};
