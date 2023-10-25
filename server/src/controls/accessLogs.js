import { AccessLogModel } from "../models/AccessLogs.js";

const createAccessLog = async (logData) => {
    try {
        const accessLog = new AccessLogModel(logData);
        const result = await accessLog.save();
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllAccessLogs = async () => {
    try {
        const logs = await AccessLogModel.find();
        return logs;
    } catch (error) {
        throw error;
    }
};

const deleteAccessLog = async (logId) => {
    try {
        const result = await AccessLogModel.findByIdAndRemove(logId);
        return result;
    } catch (error) {
        throw error;
    }
};

export { createAccessLog, getAllAccessLogs, deleteAccessLog };