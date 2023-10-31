// Import the DatabaseLogModel from the models directory
import { DatabaseLogModel } from "../models/DatabaseLogs.js";

// Define a function to create a log
const createLog = async (logData) => {
    try {
        const result = await DatabaseLogModel.create(logData);
        return result;
    } catch (error) {
        throw new Error(`Error creating log: ${error.message}`);
    }
};

const logRequest = async (req, next) => {
    const certificate_id = req.certificate_id;  // Assuming the data is sent in the request body
    const timestamps = new Date().toISOString();  // Getting the current timestamp
    const query_type = req.method;  // Assuming the data is sent in the request body
    console.log("smth");

    const databaseLogData = {
        certificate_id,
        timestamps,
        query_type,
    };

    try {
        // Create the database log
        await createLog(databaseLogData);
        next();
    } catch (error) {
        // Handle the error (log it or respond to the client)
        console.error(error);
        next(error);
    }
};

// Define a function to get all database logs
const getAllDatabaseLogs = async () => {
    try {
        const logs = await DatabaseLogModel.find();
        return logs;
    } catch (error) {
        throw new Error(`Error fetching logs: ${error.message}`);
    }
};

// Define a function to delete a database log
const deleteDatabaseLog = async (logId) => {
    try {
        const result = await DatabaseLogModel.findByIdAndRemove(logId);
        return result;
    } catch (error) {
        throw new Error(`Error deleting log: ${error.message}`);
    }
};

// Export the functions for use in other files
export { logRequest, getAllDatabaseLogs, deleteDatabaseLog };
