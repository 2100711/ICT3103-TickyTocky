import { SerialNumberModel } from "../models/SerialNumbers.js";

// Create a new Serial Number
const createSerialNumbers = async (serialNumbers, session) => {
  try {
    const sessionOptions = session ? { session } : {};

    const { case_serial, movement_serial, dial, bracelet_strap, crown_pusher } =
      serialNumbers;
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

// Get all Serial Numbers
const getAllSerialNumbers = async (serialNumbers) => {
  try {
    const serialNumbers = await SerialNumberModel.find();
    return serialNumbers;
  } catch (error) {
    throw error;
  }
};

// Get Serial Numbers by ID
const getSerialNumbers = async (serialNumbers) => {
  try {
    const serialNumbers = await SerialNumberModel.findById(serialNumbers._id);

    if (!serialNumbers) {
      throw error;
    }

    return serialNumbers;
  } catch (error) {
    throw error;
  }
};

// Update Serial Numbers by ID
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

    const serial_data = await SerialNumberModel.findById({ _id: serial_id });
    if (!serial_data) throw new Error("Serial Numbers not found.");

    const updatedSerialNumbers = await SerialNumberModel.findOneAndUpdate(
      { _id: serial_id },
      { case_serial, movement_serial, dial, bracelet_strap, crown_pusher },
      { new: true, ...sessionOptions }
    );

    if (!updatedSerialNumbers) {
      throw new Error("Serial Numbers not found.");
    }

    return updatedSerialNumbers._id;
  } catch (error) {
    throw error;
  }
};

// Delete Serial Numbers by ID
const deleteSerialNumbers = async (serialNumbers_id, session) => {
  try {
    const sessionOptions = session ? { session } : {};

    const serial = await SerialNumberModel.findById(serialNumbers_id);

    if (!serial) throw new Error("Serial Numbers not found");

    const deletedSerialNumbers = await SerialNumberModel.findByIdAndRemove(
      serialNumbers_id,
      {
        ...sessionOptions,
      }
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
