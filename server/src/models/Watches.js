import mongoose from "mongoose";
import { SerialModel } from "./Serial.js";

const WatchSchema = new mongoose.Schema({
    brand: {
        type: String,
        maxlength: 100,
        required: true,
    },
    model_no: {
        type: String,
        maxlength: 10,
        required: true,
    },
    model_name: {
        type: String,
        maxlength: 100,
        required: true,
    },
    movement: {
        type: String,
        maxlength: 100,
        required: true,
    },
    case_material: {
        type: String,
        maxlength: 100,
        required: true,
    },
    bracelet_strap_material: {
        type: String,
        maxlength: 100,
        required: true,
    },
    yop: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        maxlength: 6,
        required: true,
    },
    serial_id: {
        type: mongoose.Schema.Types.ObjectId, // Corrected usage
        ref: SerialModel,
        required: true,
    },
});

export const WatchModel = mongoose.model("watches", WatchSchema);