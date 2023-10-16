import mongoose from "mongoose";
import { UserModel } from "./Users.js";
import { WatchModel } from "./Watches.js";

const CertSchema = new mongoose.Schema({
    user_email: {
        type: String,
        ref: UserModel, // Reference to the UserModel
        required: true,
    },
    validated_by: {
        type: String,
        maxlength: 255,
        required: true,
    },
    date_of_validation: {
        type: String,
        maxlength: 255,
        required: true,
    },
    watch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WatchModel, // Reference to the WatchModel
        required: true,
    },
    issue_date: {
        type: Date,
        required: true,
    },
    expiry_date: {
        type: Date,
        required: true,
    },
    remarks: {
        type: String,
        maxlength: 255,
        required: true,
    },
    pdf_content: {
        type: String,
        required: true,
    },
});

export const CertModel = mongoose.model("certs", CertSchema);