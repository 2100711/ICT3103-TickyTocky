// Import the SecurityLogModel from the models directory
import { SecurityLogModel } from "../models/SecurityLogs.js";

// Define a function to create a log
const createLog = async (logData) => {
    try {
        const result = await SecurityLogModel.create(logData);
        return result;
    } catch (error) {
        throw new Error(`Error creating log: ${error.message}`);
    }
};

const logRequest = async (req, next) => {
     // Extract necessary data from the request object
     const user_id = req.user ? req.user._id : null;  
     const ip_address = req.ip;  
     const login_attempts = req.body.loginAttempts;  // Assuming login attempts data is sent in the request body
     const timestamps = new Date().toISOString();  // Getting the current timestamp


    const securityLogData = {
        user_id,
        login_attempts,
        ip_address,
        timestamps,
    };

    try {
        // Create the security log
        await createLog(securityLogData);
        next();
    } catch (error) {
        // Handle the error (log it or respond to the client)
        console.error(error);
        next(error);
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
export { logRequest, getAllSecurityLogs, deleteSecurityLog };
