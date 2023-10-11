import { SerialNumberModel } from "../models/SerialNumbers.js";

// Create a new Serial Number
const createSerialNumbers = async (serialNumbers) => {
  const { case_serial, movement_serial, dial, bracelet_strap, crown_pusher } =
    serialNumbers;
  try {
    const serialNumbersData = new SerialNumberModel({
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    });

    await serialNumbersData.save();

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
const updateSerialNumbers = async (serialNumbers) => {
  try {
    const updatedSerialNumbers = await SerialNumberModel.findOneAndUpdate(
      serialNumbers._id,
      serialNumbers,
      { new: true }
    );

    if (!updatedSerialNumbers) {
      throw error;
    }

    return updatedSerialNumbers;
  } catch (error) {
    throw error;
  }
};

// Delete Serial Numbers by ID
const deleteSerialNumbers = async (serialNumbers) => {
  try {
    const deletedSerialNumbers = await SerialNumberModel.findByIdAndRemove(
      serialNumbers._id
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
