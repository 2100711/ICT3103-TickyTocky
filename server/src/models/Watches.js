import mongoose from "mongoose";
import { SerialNumberModel } from "./SerialNumbers.js";

const WatchSchema = new mongoose.Schema({
    brand: {
        type: String,
        maxlength: 255,
        required: true,
    },
    model_no: {
        type: String,
        maxlength: 255,
        required: true,
    },
    model_name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    movement: {
        type: String,
        maxlength: 255,
        required: true,
    },
    case_material: {
        type: String,
        maxlength: 255,
        required: true,
    },
    bracelet_strap_material: {
        type: String,
        maxlength: 255,
        required: true,
    },
    yop: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        maxlength: 1,
        minlength: 1,
        required: true,
    },
    serial_id: {
        type: mongoose.Schema.Types.ObjectId, // Corrected usage
        ref: SerialNumberModel,
        required: true,
    },
});

export const WatchModel = mongoose.model("watches", WatchSchema);