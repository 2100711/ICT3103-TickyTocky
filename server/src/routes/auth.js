import express from "express";

import {
    isAuthenticated,
    checkAuth,
    register,
    login,
    logout,
    generateOTP,
    verifyOTP,
} from "../controls/auth.js";
import {
    logRequest,
} from "../controls/accessLogs.js";
import { validateRegister } from "../controls/validation.js";

const authRouter = express.Router();

// TODO: Forgot Password?
authRouter.get("/check-auth", isAuthenticated, checkAuth, logRequest);
authRouter.post("/register", validateRegister, register, logRequest);
authRouter.post("/login", logRequest, login);
authRouter.get("/logout", logout, logRequest);
authRouter.post("/generate-otp", generateOTP, logRequest);
authRouter.post("/verify-otp", verifyOTP, logRequest);

export { authRouter };