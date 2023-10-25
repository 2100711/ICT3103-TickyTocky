import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import rateLimit from 'express-rate-limit'; 

import { UserModel } from "../models/Users.js";
import { OtpModel } from "../models/Otp.js";
import { createAccessLog } from "../controls/accessLogs.js";

import {
  EMAIL_NAME,
  EMAIL_ADDR,
  EMAIL_PASS,
  EMAIL_USER,
} from "../constants.js";

// to be added 
// const app = express();

// // Rate limiting middleware
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max: 5,  // limit each IP to 5 login requests per windowMs
// });

// app.post('/login', loginLimiter, login);

// // Backend validation functions
// const validateEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//   return emailRegex.test(email);
// };

// const validatePassword = (password) => {
//   const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{12,64}$/; // Minimum length of 12 characters. Maximum length of 64 characters.Include 1 lowercase letter [a-z], Include 1 uppercase letter [A-Z], Include 1 numeric digit (0-9), Include 1 special character (e.g., !, @, #, 
//   return passwordRegex.test(password);
// };

// const validateName = (name) => {
//   const nameRegex = /^[A-Za-z\s]{1,35}$/; // Is at least 1 character long and no more than 35 characters and Includes only letters (either lowercase or uppercase) and spaces
//   return nameRegex.test(name);
// };

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
  const user = await UserModel.findOne({ email: email });
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

  // if (!validateEmail(email) || !validatePassword(password) || !validateName(f_name) || !validateName(l_name)) {
  //   return res.status(400).json({ error: "Invalid input format." });
  // }

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
      f_name: f_name,
      l_name: l_name,
      email: email,
      encrypted_password: hashedPassword,
      // salt: saltedText,
    });
    const ip_address = req.ip;
    const user = await UserModel.findOne({ email: email });
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (err) {
    return res.status(500).json({ error: err }); // TODO:  error: 'Server error'
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email);
  console.log("password: ", password);
  try {
    const user = await UserModel.findOne({ email });
    const ip_address = req.ip;
    const user_agent = req.get("User-Agent");
    const http_status_codes = res.statusCode;
    const requested_url = req.url;
    const accessLogData = {
      ip_address,
      user_id: user,
      user_agent,
      http_status_codes,
      requested_url,
    };

    const accessLog = createAccessLog(accessLogData);
    console.log(user);

    if (!user || !(await bcrypt.compare(password, user.encrypted_password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // If want to only allow one active session
    // TODO: make this work by deleting current session first
    console.log("session: ", req.session.user);
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

    return res
      .status(201)
      .json({ success: true, message: "Login successful.", role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const logout = async (req, res) => {
  const email = req.session.user.email;
  const user = await UserModel.findOne({ email: email });
  const ip_address = req.ip;
  const user_agent = req.get("User-Agent");
  const http_status_codes = res.statusCode;
  const requested_url = req.url;
  const accessLogData = {
    ip_address,
    user_id: user,
    user_agent,
    http_status_codes,
    requested_url,
  };

  const accessLog = createAccessLog(accessLogData);
  req.session.destroy();
  return res.status(200).json({ success: true, message: "Logged out." });
};

const generateOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const token = generateRandomOTP(); //TODO: change random seed generated using a cryptographically secure pseudo-random number generator (CSPRNG).

    const doc = await OtpModel.create({
      user_email: email,
      token: token,
    });

    emailToUser(email, token);

    return res.status(200).json({
      message: `otp created`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

const emailToUser = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // TODO: Set to true
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
      address: EMAIL_ADDR,
    },
    to: email,
    subject: "Ticky Tocky One-Time-Password",
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to send email." });
    } else {
      return res.status(200).json({ message: "Email sent." });
    }
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const token = await OtpModel.findOne({ user_email: email, token: otp });
    console.log("what is the token: ", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Incorrect OTP entered or OTP has expired." });
    }

    // TODO: create session so user can reset password?

    return res.status(200).json({ message: "OTP verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

export {
  isAuthenticated,
  isAdmin,
  userExists,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  verifyOTP,
};
