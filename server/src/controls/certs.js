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

const createCert = async (req, res) => {
    try {
        const session = await CertModel.startSession();
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
        const cert = new CertModel({
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
            success: true,
            message: "Certificates created successfully",
            certs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating certificates",
        });
    }
};

const getAllCerts = async (req, res) => {
    try {
        const certs = await CertModel.find().select("_id user_email");
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
        const _id = req.params.certID;
        const cert = await CertModel.findById(_id).populate({
            path: "watch_id",
            select: "-_id",
            populate: {
                path: "serial_id",
                select: "-_id",
            },
        });
        if (!cert) {
            return res.status(404).json({ success: false, message: "Certificate not found" });
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
        const { _id, current_email, next_email } = req.body;

        if (current_email === next_email)
            return res.status(500).json({ success: false, message: "An error occurred." });

        const cert = await CertModel.findById(_id);

        if (!cert)
            return res.status(500).json({ success: false, message: "An error occurred." });

        if (
            cert.user_email !== current_email ||
            cert.user_email !== req.session.user.email
        )
            return res.status(401).json({ success: false, message: "Unauthorized." });

        const query = { _id };
        const update = {
            user_email: next_email,
        };

        const updatedCert = await CertModel.findOneAndUpdate(query, update, {
            new: true,
            select: "-watch_id",
        });

        if (!updatedCert) {
            return res.status(404).json({ success: false, message: "Certificate not found" });
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
            _id,
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

        const cert = await CertModel.findById(_id);

        if (!cert)
            return res.status(404).json({ success: false, message: "Certificate not found." });

        const user_exist = await userExists(user_email);
        if (!user_exist)
            return res.status(404).json({ success: false, message: "User not found." });

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

        const query = { _id };

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
        });

        if (!updatedCert) {
            return res.status(404).json({ success: false, message: "Certificate not found" });
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
        const { _id } = req.body;

        const cert = await CertModel.findById(_id);

        if (!cert)
            return res.status(404).json({ success: false, message: "Certificate not found" });

        session.startTransaction();

        const deletedWatch = await deleteWatch(cert.watch_id, session);

        const deletedCert = await CertModel.findOneAndDelete(_id, { session });

        if (!deletedCert) {
            return res.status(404).json({ success: false, message: "Certificate not found" });
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