import express from "express";

import {
  isAuthenticated,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  resetPassword,
  updatePassword,
  generateCSRFToken,
  checkCSRFTokenSTP,
} from "../controls/auth.js";
import { logRequest as accessLogRequest } from "../controls/accessLogs.js";
import { logRequest as securityLogRequest } from "../controls/securityLogs.js";
import { validateRegister } from "../controls/validation.js";

const authRouter = express.Router();


authRouter.get("/check-auth", isAuthenticated, checkAuth, accessLogRequest);
authRouter.post("/register", validateRegister, register, accessLogRequest);
authRouter.post("/login", login, securityLogRequest);
authRouter.get("/logout", logout);
authRouter.post("/generate-otp", generateOTP, accessLogRequest);
authRouter.post("/reset-password", resetPassword, accessLogRequest);
authRouter.post("/update-password", updatePassword, accessLogRequest);
authRouter.get("/generate-csrf-token", generateCSRFToken);
export { authRouter };
