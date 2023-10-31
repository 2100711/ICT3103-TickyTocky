import express from "express";

import {
  isAuthenticated,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  verifyOTP,
  resetPassword,
} from "../controls/auth.js";
import { logRequest as accessLogRequest } from "../controls/accessLogs.js";
import { logRequest as securityLogRequest } from "../controls/securityLogs.js";
import { validateRegister } from "../controls/validation.js";

const authRouter = express.Router();

// TODO: Forgot Password?
authRouter.get("/check-auth", isAuthenticated, checkAuth, accessLogRequest);
authRouter.post("/register", validateRegister, register, accessLogRequest);
authRouter.post("/login", login, securityLogRequest);
authRouter.get("/logout", logout, accessLogRequest);
authRouter.post("/generate-otp", generateOTP, accessLogRequest);
authRouter.post("/verify-otp", verifyOTP, accessLogRequest);
authRouter.post("/reset-password", resetPassword, accessLogRequest);

export { authRouter };
