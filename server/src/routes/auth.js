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

const authRouter = express.Router();

// TODO: Forgot Password?
authRouter.get("/check-auth", isAuthenticated, checkAuth);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/generate-otp", generateOTP);
authRouter.post("/verify-otp", verifyOTP);

export { authRouter };
