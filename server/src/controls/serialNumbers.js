import { SerialNumberModel } from "../models/SerialNumbers.js";

const createSerialNumbers = async (serialNumbers, session) => {
    try {
        const sessionOptions = session ? { session } : {};

        const {
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher
        } = serialNumbers;

        const serialNumbersData = new SerialNumberModel({
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        });

        await serialNumbersData.save(sessionOptions);

        return serialNumbersData._id;
    } catch (error) {
        throw error;
    }
};

const getAllSerialNumbers = async () => {
    try {
        return await SerialNumberModel.find();
    } catch (error) {
        throw error;
    }
};

const getSerialNumbers = async (serialNumbersId) => {
    try {
        const serialNumbers = await SerialNumberModel.findById(serialNumbersId);

        if (!serialNumbers) {
            throw new Error("Serial Numbers not found.");
        }

        return serialNumbers;
    } catch (error) {
        throw error;
    }
};

const updateSerialNumbers = async (serialNumbers, session) => {
    try {
        const {
            serial_id,
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        } = serialNumbers;

        const sessionOptions = session ? { session } : {};

        const serialData = await SerialNumberModel.findById(serial_id);
        if (!serialData) throw new Error("Serial Numbers not found.");

        const updatedSerialNumbers = await SerialNumberModel.findOneAndUpdate({ _id: serial_id }, { case_serial, movement_serial, dial, bracelet_strap, crown_pusher }, { new: true, ...sessionOptions });

        if (!updatedSerialNumbers) {
            throw new Error("Serial Numbers not found.");
        }

        return updatedSerialNumbers._id;
    } catch (error) {
        throw error;
    }
};

const deleteSerialNumbers = async (serialNumbersId, session) => {
    try {
        const sessionOptions = session ? { session } : {};

        const serial = await SerialNumberModel.findById(serialNumbersId);

        if (!serial) throw new Error("Serial Numbers not found");

        const deletedSerialNumbers = await SerialNumberModel.findByIdAndRemove(
            serialNumbersId, { ...sessionOptions }
        );

        if (!deletedSerialNumbers) {
            throw error;
        }

        return deletedSerialNumbers;
    } catch (error) {
        throw error;
    }
};

export {
    createSerialNumbers,
    getAllSerialNumbers,
    getSerialNumbers,
    updateSerialNumbers,
    deleteSerialNumbers,
};