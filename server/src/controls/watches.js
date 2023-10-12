import { WatchModel } from "../models/Watches.js";
import {
  createSerialNumbers,
  getAllSerialNumbers,
  getSerialNumbers,
  updateSerialNumbers,
  deleteSerialNumbers,
} from "../controls/serialNumbers.js";

// Create a new watch
const createWatch = async (watch, session) => {
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
  try {
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

    const watch_data = await WatchModel.findById({ _id: watch_id });

    if (!watch_data) throw new Error("Watch not found.");

    const serialNumbers = {
      serial_id: watch_data.serial_id,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    };

    const serial_id = await updateSerialNumbers(serialNumbers, session);

    const updatedWatch = await WatchModel.findOneAndUpdate(
      { _id: watch_id },
      {
        brand,
        model_no,
        model_name,
        movement,
        case_material,
        bracelet_strap_material,
        yop,
        gender,
      },
      {
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

// Delete a watch by ID
const deleteWatch = async (watch_id, session) => {
  try {
    const sessionOptions = session ? { session } : {};

    const watch = await WatchModel.findById(watch_id);

    if (!watch) throw new Error("Watch not found");

    const deletedSerial = await deleteSerialNumbers(watch.serial_id, session);

    const deletedWatch = await WatchModel.findByIdAndRemove(watch_id, {
      ...sessionOptions,
    });

    if (!deletedWatch) {
      throw error;
    }
    return deletedWatch;
  } catch (error) {
    throw error;
  }
};

export { createWatch, getAllWatches, getWatch, updateWatch, deleteWatch };
