import { CertModel } from "../models/Certs.js";
import { UserModel } from "../models/Users.js";
import { createWatch, updateWatch, deleteWatch } from "../controls/watches.js";
import { userExists } from "../controls/auth.js";
import { checkDupCertId } from "../controls/validation.js";
import { createPdfContent } from "../controls/pdf.js";
import mongoose from "mongoose";

// Generate a random certificate ID
const generateRandomCertId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charLength = characters.length;
  let result = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const createCert = async (req, res) => {
  const session = await CertModel.startSession();
  session.startTransaction();

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

    const watch_id = await createWatch(watch, session);

    let randomCertId = generateRandomCertId(16);
    while (await checkDupCertId(randomCertId)) {
      randomCertId = generateRandomCertId(16);
    }

    const cert = new CertModel({
      cert_id: randomCertId,
      user_email,
      validated_by,
      date_of_validation,
      watch_id,
      issue_date,
      expiry_date,
      remarks,
    });

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
  session.startTransaction();

  try {
    const certDataArray = req.body;
    const certContents = [];

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
      let randomCertId = generateRandomCertId(16);
      while (await checkDupCertId(randomCertId)) {
        randomCertId = generateRandomCertId(16);
      }

      certContents.push({
        cert_id: randomCertId,
        user_email: certData.user_email,
        validated_by: certData.validated_by,
        date_of_validation: certData.date_of_validation,
        watch_id,
        issue_date: certData.issue_date,
        expiry_date: certData.expiry_date,
        remarks: certData.remarks,
      });
    }

    const certs = await CertModel.insertMany(certContents);

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
    const certs = await CertModel.find(
      {},
      { _id: 0, cert_id: 1, user_email: 1 }
    );

    res.status(200).json({
      success: true,
      message: "All certificates retrieved",
      certs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getCert = async (req, res) => {
  try {
    const cert_id = req.params.certID;

    const cert = await findCertificateByCertId(cert_id);

    console.log("CERT", cert);

    if (!cert) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    let isAdmin = {};
    if (req.session.user) {
      isAdmin = await findUserRoleByEmail(req.session.user.email);
    }

    if (!isUserAuthorized(req.session.user, cert.user_email, isAdmin.role)) {
      obfuscateSensitiveData(cert);
    }

    const pdf_content = await createPdfContent(cert);

    res.status(200).json({
      success: true,
      message: "Certificate found",
      pdf_content,
      cert: cert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getCertsByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (email !== req.session.user?.email) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid request" });
    }
    const certs = await CertModel.find(
      { user_email: email },
      { _id: 0, cert_id: 1, user_email: 1 }
    );
    // console.log("CERTSBYEMAIL:", certs);
    if (!certs) {
      return res.status(200).json({
        success: false,
        message: "Certificates not found for this user",
      });
    }

    console.log("CERTSBACKEND", certs);

    return res
      .status(200)
      .json({ success: false, message: "Certificates retrieved", certs });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

async function findCertificateByCertId(cert_id) {
  return await CertModel.findOne({ cert_id }, { _id: 0 }).populate({
    path: "watch_id",
    select: "-_id",
    populate: {
      path: "serial_id",
      select: "-_id",
    },
  });
}

async function findUserRoleByEmail(email) {
  return await UserModel.findOne({ email }).select("-_id role");
}

function isUserAuthorized(sessionUser, certUserEmail, adminRole) {
  return (
    (sessionUser && sessionUser.email === certUserEmail) ||
    adminRole === "admin"
  );
}

function obfuscateSensitiveData(cert) {
  if (cert.watch_id && cert.watch_id.serial_id) {
    const obfuscateFields = [
      "case_serial",
      "movement_serial",
      "dial",
      "bracelet_strap",
      "crown_pusher",
    ];
    for (const field of obfuscateFields) {
      cert.watch_id.serial_id[field] = "XXXXXX";
    }
  }
}

function isUserAuthorisedForTransferOwnership(
  cert_email,
  current_email,
  session_email
) {
  return cert_email !== current_email || cert_email !== session_email
    ? true
    : false;
}

const transferOwnershipCert = async (req, res) => {
  try {
    const { cert_id, current_email, next_email } = req.body;

    const cert = await CertModel.findOne({ cert_id });

    if (
      isUserAuthorisedForTransferOwnership(
        cert.user_email,
        current_email,
        req.session.user.email
      )
    )
      return res.status(403).json({ success: false, message: "Unauthorized." });

    const query = { cert_id: cert_id };

    let randomCertId = generateRandomCertId(16);
    while (await checkDupCertId(randomCertId)) {
      randomCertId = generateRandomCertId(16);
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
  getCertsByEmail,
  transferOwnershipCert,
  updateCert,
  deleteCert,
};
