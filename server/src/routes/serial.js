import express from "express";

import { checkSerial } from "../controls/serials.js";
import { logRequest } from "../controls/accessLogs.js";
import { isAuthenticated } from "../controls/auth.js";

const serialRouter = express.Router();
serialRouter.get("/check-serial", isAuthenticated, checkSerial, logRequest);

export { serialRouter };
