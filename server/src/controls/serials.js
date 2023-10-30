import { SerialModel } from "../models/Serial.js";

const createSerial = async (serial, session) => {
    try {
        const sessionOptions = session ? { session } : {};

        const {
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher
        } = serial;

        const serialData = new SerialModel({
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        });

        await serialData.save(sessionOptions);

        return serialData._id;
    } catch (error) {
        throw error;
    }
};

const getAllSerials = async () => {
    try {
        return await SerialModel.find();
    } catch (error) {
        throw error;
    }
};

const getSerial = async (serialId) => {
    try {
        const serial = await SerialModel.findById(serialId);

        if (!serial) {
            throw new Error("Serial Numbers not found.");
        }

        return serial;
    } catch (error) {
        throw error;
    }
};

const updateSerial = async (serial, session) => {
    try {
        const {
            serial_id,
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        } = serial;

        const sessionOptions = session ? { session } : {};

        const serialData = await SerialModel.findById(serial_id);
        if (!serialData) throw new Error("Serial Numbers not found.");

        const updatedSerial = await SerialModel.findOneAndUpdate({ _id: serial_id }, { case_serial, movement_serial, dial, bracelet_strap, crown_pusher }, { new: true, ...sessionOptions });

        if (!updatedSerial) {
            throw new Error("Serial Numbers not found.");
        }

        return updatedSerial._id;
    } catch (error) {
        throw error;
    }
};

const deleteSerial = async (serialId, session) => {
    try {
        const sessionOptions = session ? { session } : {};

        const serial = await SerialModel.findById(serialId);

        if (!serial) throw new Error("Serial Numbers not found");

        const deletedSerial = await SerialModel.findByIdAndRemove(
            serialId, { ...sessionOptions }
        );

        if (!deletedSerial) {
            throw error;
        }

        return deletedSerial;
    } catch (error) {
        throw error;
    }
};

const duplicateSerial = async (serial, session) => {
    try {
        const {
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        } = serial;

        const sessionOptions = session ? { session } : {};

        const duplicateSerial = await SerialModel.findOne({
            $or: [
                { case_serial },
                { movement_serial },
                { dial },
                { bracelet_strap },
                { crown_pusher },
            ],
        });
        return duplicateSerial ? true : false;
    } catch (error) {
        throw error;
    }
}

export {
    createSerial,
    getAllSerials,
    getSerial,
    updateSerial,
    deleteSerial,
    duplicateSerial,
};