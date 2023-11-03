import { AccessLogModel } from "../models/AccessLogs.js";

// Define a more generic function for creating a log
const createLog = async (logData) => {
  try {
    console.log("CREATEACCESSLOG", logData)
    const result = await AccessLogModel.create(logData);
    return result;
  } catch (error) {
    throw new Error(`Error creating log: ${error.message}`);
  }
};

const logRequest = async (req, res, next) => {
  const ip_address = req.ip;
  const user_agent = req.get("User-Agent");
  const http_status_codes = res.statusCode;
  const requested_url = req.url;
  const user_id = req.user_id; // Assuming you have user info in the request
  
  const accessLogData = {
    ip_address,
    user_id,
    user_agent,
    http_status_codes,
    requested_url,
  };

  console.log("accessLogData ", accessLogData);

  try {
    // Create the access log
    const log = await createLog(accessLogData);
  } catch (error) {
    // Handle the error (log it or respond to the client)
    console.error(error);
  }
};

const getAllAccessLogs = async () => {
  try {
    const logs = await AccessLogModel.find();
    return logs;
  } catch (error) {
    throw new Error(`Error fetching logs: ${error.message}`);
  }
};

const deleteAccessLog = async (logId) => {
  try {
    const result = await AccessLogModel.findByIdAndRemove(logId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting log: ${error.message}`);
  }
};

export { logRequest, getAllAccessLogs, deleteAccessLog };
