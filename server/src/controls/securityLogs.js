// Import the SecurityLogModel from the models directory
import { SecurityLogModel } from "../models/SecurityLogs.js";
import { lockAccount } from "./auth.js";

// Define a function to create a log
const createLog = async (logData) => {
  try {
    const result = await SecurityLogModel.create(logData);
    return result;
  } catch (error) {
    throw new Error(`Error creating log: ${error.message}`);
  }
};

const logRequest = async (req, res, next) => {
  try {
    // Extract necessary data from the request object
    const user_id = req._id;
    const ip_address = req.ip;

    let login_attempts = 0;
    if (!req.attemptSuccess) {
      const latest_login_attempt = await SecurityLogModel.findOne(
        { user_id: user_id }, // Replace your_user_id with the specific user's ObjectId
        {},
        { sort: { timestamps: -1 } }
      );

      login_attempts = latest_login_attempt
        ? latest_login_attempt.login_attempts + 1
        : 1;
    }

    if (login_attempts >= 5) {
      const result = await lockAccount(user_id);
      if (!result) console.error("Error locking user account.");
    }

    const securityLogData = {
      user_id,
      login_attempts,
      ip_address,
    };

    // Create the security log
    await createLog(securityLogData);
  } catch (error) {
    // Handle the error (log it or respond to the client)
    console.error(error);
  }
};

// Define a function to get all security logs
const getAllSecurityLogs = async () => {
  try {
    const logs = await SecurityLogModel.find();
    return logs;
  } catch (error) {
    throw new Error(`Error fetching logs: ${error.message}`);
  }
};

// Define a function to delete a security log
const deleteSecurityLog = async (logId) => {
  try {
    const result = await SecurityLogModel.findByIdAndRemove(logId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting log: ${error.message}`);
  }
};

// Export the functions for use in other files
export { createLog, logRequest, getAllSecurityLogs, deleteSecurityLog };
