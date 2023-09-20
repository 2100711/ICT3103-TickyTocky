import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;

// Server
export const PORT = 3001;
export const MONGODB_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@testingauctionsystem.5zpmbym.mongodb.net/testingauctionsystem?retryWrites=true&w=majority`;

// Error message
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
