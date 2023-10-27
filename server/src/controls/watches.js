import { WatchModel } from "../models/Watches.js";
import {
    createSerialNumbers,
    getAllSerialNumbers,
    getSerialNumbers,
    updateSerialNumbers,
    deleteSerialNumbers,
} from "../controls/serialNumbers.js";

const createWatch = async (watch, session) => {
    try {
        const {
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
            brand,
            model_no,
            model_name,
            movement,
            case_material,
            bracelet_strap_material,
            yop,
            gender,
        } = watch;
        const sessionOptions = session ? { session } : {};
        const serialNumbers = {
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        };
        const serial_id = await createSerialNumbers(serialNumbers, session);
        const watchData = new WatchModel({
            brand,
            model_no,
            model_name,
            movement,
            case_material,
            bracelet_strap_material,
            yop,
            gender,
            serial_id,
        });
        await watchData.save(sessionOptions);
        return watchData._id;
    } catch (error) {
        throw error;
    }
};

const getAllWatches = async () => {
    try {
        const watches = await WatchModel.find();
        return watches;
    } catch (error) {
        throw error;
    }
};

const getWatch = async (watchId) => {
    try {
        const watch = await WatchModel.findById(watchId);
        if (!watch) {
            throw new Error("Watch not found.");
        }
        return watch;
    } catch (error) {
        throw error;
    }
};

const updateWatch = async (watch, session) => {
    try {
        const {
            watch_id,
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
            brand,
            model_no,
            model_name,
            movement,
            case_material,
            bracelet_strap_material,
            yop,
            gender,
        } = watch;
        const sessionOptions = session ? { session } : {};
        const watchData = await WatchModel.findById(watch_id);
        if (!watchData) {
            throw new Error("Watch not found.");
        }
        const serialNumbers = {
            serial_id: watchData.serial_id,
            case_serial,
            movement_serial,
            dial,
            bracelet_strap,
            crown_pusher,
        };
        const serial_id = await updateSerialNumbers(serialNumbers, session);
        const updatedWatch = await WatchModel.findByIdAndUpdate(
            watch_id, {
                brand,
                model_no,
                model_name,
                movement,
                case_material,
                bracelet_strap_material,
                yop,
                gender,
            }, {
                new: true,
                ...sessionOptions,
            }
        );
        if (!updatedWatch) {
            throw new Error("Watch not found.");
        }
        return updatedWatch._id;
    } catch (error) {
        throw error;
    }
};

const deleteWatch = async (watch_id, session) => {
    try {
        const sessionOptions = session ? { session } : {};
        const watch = await WatchModel.findById(watch_id);
        if (!watch) {
            throw new Error("Watch not found.");
        }
        const deletedSerial = await deleteSerialNumbers(watch.serial_id, session);
        const deletedWatch = await WatchModel.findByIdAndRemove(watch_id, {
            ...sessionOptions,
        });
        if (!deletedWatch) {
            throw new Error("Watch not found.");
        }
        return deletedWatch;
    } catch (error) {
        throw error;
    }
};

export { createWatch, getAllWatches, getWatch, updateWatch, deleteWatch };