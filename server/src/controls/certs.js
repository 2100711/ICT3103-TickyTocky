import { CertModel } from '../models/Certs.js'; // Import your Mongoose model
import XLSX from 'xlsx';

// Create a new cert
const createCert = async (certData) => {
    try {
        const cert = new CertModel(certData);
        const result = await cert.save();
        return result;
    } catch (error) {
        throw error;
    }
};

// Batch create certs
const createCerts = async (file) => {
    try { // Read the uploaded Excel file
        const workbook = XLSX.read(file.data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to an array of objects
        const certDataArray = XLSX.utils.sheet_to_json(worksheet);

        // Create certs from the extracted data
        const certs = await CertModel.insertMany(certDataArray);

        return certs;
    } catch (error) {
        throw error;
    }
};

// Get all certs
const getAllCerts = async () => {
    try {
        const certs = await CertModel.find();
        return certs;
    } catch (error) {
        throw error;
    }
};

// Get a cert by ID
const getCert = async (certID) => {
    try {
        const cert = await CertModel.findById(certID);
        return cert;
    } catch (error) {
        throw error;
    }
};

// Update a cert by ID
const updateCert = async (certID, updateData) => {
    try {
        const updatedCert = await CertModel.findByIdAndUpdate(
            certID,
            updateData, { new: true }
        );
        return updatedCert;
    } catch (error) {
        throw error;
    }
};

// Delete a cert by ID
const deleteCert = async (certID) => {
    try {
        const result = await CertModel.findByIdAndRemove(certID);
        return result;
    } catch (error) {
        throw error;
    }
};

export {
    createCert,
    createCerts,
    getAllCerts,
    getCert,
    updateCert,
    deleteCert,
};