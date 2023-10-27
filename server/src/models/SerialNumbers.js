import mongoose from "mongoose";

const SerialNumberSchema = new mongoose.Schema({
    case_serial: {
        type: String,
        maxlength: 8,
        required: true,
    },
    movement_serial: {
        type: String,
        maxlength: 12,
        required: true,
    },
    dial: {
        type: String,
        maxlength: 8,
        required: true,
    },
    bracelet_strap: {
        type: String,
        maxlength: 8,
    },
    crown_pusher: {
        type: String,
        maxlength: 7,
    },
});

export const SerialNumberModel = mongoose.model(
    "serial_numbers",
    SerialNumberSchema
);