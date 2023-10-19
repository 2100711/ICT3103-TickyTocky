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
import { userExists } from "../controls/auth.js";
import { createPdfContent, createPdfContents } from "../controls/pdf.js";

// Function to generate a random alphanumeric string with the first three characters as random capital letters and the last three characters as random digits
const generateRandomCertId = () => {
    const getRandomLetter = () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const getRandomDigit = () => String(Math.floor(Math.random() * 10)); // 0-9

    let result = "";
    for (let i = 0; i < 3; i++) {
        result += getRandomLetter();
    }
    for (let i = 0; i < 3; i++) {
        result += getRandomDigit();
    }

    return result;
};

// Function to check if the alphanumeric string exists in the database
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

        // Create random cert-id
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

        await cert.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Certificate created",
            cert,
        });
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: "An error occurred" });
        const watch_id = await createWatch(watch, session);
    }
};

const createCerts = async (req, res) => {
    const session = await CertModel.startSession();
    try {
        session.startTransaction();

        const { file } = req;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: "File not provided or invalid" });
        }

        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const certDataArray = XLSX.utils.sheet_to_json(worksheet);

        const pdfContentsArray = [];

        for (const certData of certDataArray) {
            // Create a watch
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

            // Create the watch and get the watch_id
            const watch_id = await createWatch(watch, session);

            // Create random cert-id
            let randomCertId = generateRandomCertId(6);
            let certIdExists = await checkIfCertIdExists(randomCertId);
            while (certIdExists) {
                randomCertId = generateRandomCertId(6);
                certIdExists = await checkIfCertIdExists(randomCertId);
            }

            // Create PDF content
            const pdfContent = await createPdfContent({
                cert_id: randomCertId,
                user_email: certData.user_email, // Add user_email or other relevant fields
                validated_by: certData.validated_by, // Add validated_by or other relevant fields
                date_of_validation: certData.date_of_validation, // Add date_of_validation or other relevant fields
                watch_id,
                issue_date: certData.issue_date, // Add issue_date or other relevant fields
                expiry_date: certData.expiry_date, // Add expiry_date or other relevant fields
                remarks: certData.remarks, // Add remarks or other relevant fields
            });

            pdfContentsArray.push(pdfContent);
        }

        const certs = await CertModel.insertMany(certDataArray);

        certs.forEach((cert, index) => {
            cert.pdf_content = pdfContentsArray[index];
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Certificates created successfully",
            certs,
        });
    } catch (error) {
        console.log(error);
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
        const cert = await CertModel.findOne({ cert_id: cert_id }, { _id: 0 }).populate({
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

        res.status(200).json({ success: true, message: "Certificate found", cert });
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

        // Current cert_id to identify the record
        const query = { cert_id: cert_id };

        // Create new random cert_id
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

        const deletedCert = await CertModel.findOneAndDelete({ cert_id: cert_id }, { session });

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
    transferOwnershipCert,
    updateCert,
    deleteCert,
};