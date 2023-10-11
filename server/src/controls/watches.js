import { WatchModel } from '../models/Watches.js';
import {
    createSerialNumbers,
    getAllSerialNumbers,
    getSerialNumbers,
    updateSerialNumbers,
    deleteSerialNumbers,
} from "../controls/serialNumbers.js"

// Create a new watch
const createWatch = async (watch) => {
    try {
        const serialNumbers = {
            case_serial,
            movement,
            dial,
            bracelet_strap,
            crown_pusher,
        };
        const serial_id = createSerialNumbers(serialNumbers);
        const watch = new WatchModel({
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

        await watch.save();
        return watch;
    } catch (error) {
        throw error;
    }
};

// Get all watches
const getAllWatches = async (watch) => {
    try {
        const watches = await WatchModel.find();
        return watches;
    } catch (error) {
        throw error;
    }
};

// Get a watch by ID
const getWatch = async (watch) => {
    try {
        const watch = await WatchModel.findById(watch._id);

        if (!watch) {
            throw error;
        }

        return watch;
    } catch (error) {
        throw error;
    }
};

// Update a watch by ID
const updateWatch = async (watch) => {
    try {
        const updatedWatch = await WatchModel.findOneAndUpdate(watch._id, watch, { new: true });

        if (!updatedWatch) {
            throw error;
        }

        return updatedWatch;
    } catch (error) {
        throw error;
    }
};

// Delete a watch by ID
const deleteWatch = async (watch) => {
    try {
        const deletedWatch = await WatchModel.findByIdAndRemove(watch._id);

        if (!deletedWatch) {
            throw error;
        }
        return deletedWatch;
    } catch (error) {
        throw error;
    }
};

export {
    createWatch,
    getAllWatches,
    getWatch,
    updateWatch,
    deleteWatch,
};