import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { UserModel } from "../models/Users.js";
import { OtpModel } from "../models/Otp.js";
import sanitize from 'mongo-sanitize';

import { EMAIL_NAME, EMAIL_PASS, EMAIL_USER } from "../constants.js";

const lockAccount = async (user_id) => {
  // lock account if attempt more than 5
  try {
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $set: { account_lock: true } }
    );
    if (result.acknowledged) return true;
    return false;
  } catch (error) {
    console.error(error);
  }
};

const unlockAccount = async (user_id, ip_address) => {
  // when unlocking account, create security_log record to set login_attempts back to 0
  try {
    const resetLoginAttempt = {
      user_id,
      ip_address,
      login_attempts: 0,
    };
    const result = await createLog(resetLoginAttempt);
    if (result.acknowledged) return true;
    return false;
  } catch (error) {
    console.error(error);
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res
      .status(200)
      .json({ success: false, message: "Invalid session." });
  }
};

// isAdmin function should be used only after isAuthenticated
const isAdmin = async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).select("-_id role");
  if (user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Unauthorized." });
  }
};

// Check if user exists
const userExists = async (email) => {
  const sanitizedEmail = sanitize(email);
  const user = await UserModel.findOne({ email: sanitizedEmail });
  if (user) {
    return true;
  }
  return false;
};

// Get random 6 digit number
const generateRandomOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

const checkAuth = async (req, res) => {
  const user = await UserModel.findOne({ email: req.session.user.email });

  if (!user) {
    return res.status(201).json({
      email: req.session.user.email,
      success: false,
      message: "An error occurred.",
      role: "",
    });
  }

  return res.status(201).json({
    email: req.session.user.email,
    success: true,
    message: "User is authenticated.",
    role: user.role,
  });
};

const register = async (req, res) => {
  const { f_name, l_name, email, password } = req.body;
  const sanitizedEmail = sanitize(email);
  const sanitizedFName = sanitize(f_name);
  const sanitizedLName = sanitize(l_name);

  try {
    if (await userExists(email))
      return res.status(409).json({
        success: false,
        error: "User already exist, please login instead.",
      });

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new UserModel({
      f_name: sanitizedFName,
      l_name: sanitizedLName,
      email: sanitizedEmail,
      encrypted_password: hashedPassword,
      // salt: saltedText,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = sanitize(email);
    if (!email || !password) {
      // throw new error;
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password",
      });
    }
    const user = await UserModel.findOne({ email: sanitizedEmail });

    if (!user) {
      // if no user found with email, client should not know that the email does not exist in the db.
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    if (user.account_lock) {
      req._id = user._id;
      req.attemptSuccess = false;
      next();
      return res.status(401).json({
        success: false,
        message:
          "Account is locked. Reset your password or contact administrator to unlock your account.",
      });
    }

    if (!(await bcrypt.compare(password, user.encrypted_password))) {
      req._id = user._id;
      req.attemptSuccess = false;
      next();
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // If want to only allow one active session
    // TODO: make this work by deleting current session first
    if (
      req.session.user &&
      req.session.user.email &&
      req.session.user.email === email
    ) {
      // remove previous session
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User is already logged in",
      });
    }

    req.session.user = {
      email,
    };

    await req.session.save();

    req._id = user._id;
    req.attemptSuccess = true;
    next();

    return res
      .status(201)
      .json({ success: true, message: "Login successful.", role: user.role });
  } catch (error) {
    res.status(500);
    console.error(error);
    next();
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const logout = async (req, res) => {
  req.session.destroy();
  return res.status(200).json({ success: true, message: "Logged out." });
};

const generateOTP = async (req, res) => {
  const { email } = req.body;
  const sanitizedEmail = sanitize(email);
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    // TODO: check if email exist in database
    const user = await UserModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist." });
    }

    const token = generateRandomOTP();

    const doc = await OtpModel.create({
      user_email: email,
      token: token,
    });

    const send = await emailToUser(email, token);

    if (!send.success) {
      return res.status(500).json({ success: false, message: send.message });
    }

    return res.status(200).json({
      success: true,
      message: `otp created`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "An error occurred." });
  }
};

const emailToUser = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // secure: false, // TODO: Set to true
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const emailBody = `
  <h2>Authentication</h2>

  <p>One-Time-Password : ${token}</p>
  </br>
  <p>If you did not make this request, please ignore this email.</p>
  `;

  const mailOptions = {
    from: {
      name: EMAIL_NAME,
      address: EMAIL_USER,
    },
    to: email,
    subject: "Ticky Tocky One-Time-Password",
    html: emailBody,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve({ success: false, message: "Failed to send email." });
      } else {
        resolve({ success: true, message: "Email sent." });
      }
    });
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const token = await OtpModel.findOne({ user_email: email, token: otp });
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP entered or OTP has expired.",
      });
    }

    // TODO: create session so user can reset password?

    return res.status(200).json({
      success: true,
      message: "Your OTP has been successfully verified.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const sanitizedEmail = sanitize(email);
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    const user = await UserModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist." });
    }

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { encrypted_password: hashedPassword, account_lock: false } },
      { new: true }
    );

    await unlockAccount(updatedUser._id, req.ip);

    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "An error occurred." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

export {
  unlockAccount,
  lockAccount,
  isAuthenticated,
  isAdmin,
  userExists,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  verifyOTP,
  resetPassword,
};
