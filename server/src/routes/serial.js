import express from "express";

import {
    duplicateSerial,
} from "../controls/serials.js";
import { logRequest } from "../controls/accessLogs.js";

const serialRouter = express.Router();
serialRouter.get("/check-serial", isAuthenticated, duplicateSerial, logRequest);

export { serialRouter };