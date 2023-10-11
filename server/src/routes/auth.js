import express from "express";
// import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { UserModel } from "../models/Users.js";
import { OtpModel } from "../models/Otp.js";
import {
  EMAIL_NAME,
  EMAIL_ADDR,
  EMAIL_PASS,
  EMAIL_USER,
} from "../constants.js";
import { isAuthenticated } from "../controls/auth.js";

const router = express.Router();

// Check if user exists
const userExists = async (email) => {
  const user = await UserModel.findOne({ email: email });
  console.log(user);
  if (user) {
    return true;
  }
  return false;
};

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

router.get("/check-auth", isAuthenticated, async (req, res) => {
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
});

// Register new user
router.post("/register", async (req, res) => {
  const { f_name, l_name, email, password } = req.body;
  try {
    if (userExists(email))
      return res
        .status(409)
        .json({ error: "User already exist, please login instead." });

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

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    const { email, password } = req.body;
    console.log("email: ", email);
    console.log("password: ", password);

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
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).json({ success: true, message: "Logged out." });
});

// TODO: turn it into a function
router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const token = generateOTP();

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
});

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

router.post("/verify-otp", async (req, res) => {
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
});

// Register new therapist/educator
// router.post("/register-superuser", async (req, res) => {
//     const { name, email, password, role, purpose, organisation } = req.body;

//     // Checking if user exists
//     if (await userExists(email)) {
//         return res.status(409).json({ message: "User already exists!" });
//     }

//     // Hashing password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new SuperuserModel({
//         name: name,
//         email: email,
//         password: hashedPassword,
//         role: role,
//         purpose: purpose,
//         organisation: organisation,
//     });
//     await newUser.save();

//     return res.status(201).json({ message: "User registered successfully" });
// });

// router.post("/register-admin", async (req, res) => {
//     const { name, email, password } = req.body;

//     // Checking if user exists
//     if (await userExists(email)) {
//         return res.status(409).json({ message: "User already exists" });
//     }

//     // Hashing password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new AdminModel({
//         name: name,
//         email: email,
//         password: hashedPassword,
//         role: "admin",
//     });

//     await newUser.save();

//     return res.status(201).json({ message: "User registered successfully" });
// });

// Login
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     const user = await UserModel.findOne({ email: email });
//     const superuser = await SuperuserModel.findOne({ email: email });
//     const admin = await AdminModel.findOne({ email: email });

//     let isPasswordValid;
//     let id;
//     let accountRole;
//     // Check if credentials are valid
//     if (user) {
//         ({ isPasswordValid, id, accountRole } = await verifyAccount(
//             user,
//             password
//         ));
//     } else if (superuser) {
//         ({ isPasswordValid, id, accountRole } = await verifyAccount(
//             superuser,
//             password
//         ));
//     } else if (admin) {
//         ({ isPasswordValid, id, accountRole } = await verifyAccount(
//             admin,
//             password
//         ));
//     }

//     if (!isPasswordValid) {
//         return res
//             .status(401)
//             .json({ error: "Email or password is incorrect" });
//     }

//     // Login user and return JWT token for cookie storage
//     const token = jwt.sign({ id: id, role: accountRole }, JWT_SECRET);

//     return res.status(200).json({ message: "Login success", token: token });
// });

// Forgot password
// router.post("/forgot-password", async (req, res) => {
//     const { email } = req.body;

//     const name = await userExists(email);

//     // Check if user exists
//     if (!name) {
//         return res.status(404).json({ error: "User doesn't exist" });
//     }

//     // Generate JWT token for password reset
//     // Token expiry time: 20 minutes
//     const resetToken = jwt.sign({ email }, JWT_SECRET, {
//         expiresIn: "1200s",
//     });

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: EMAIL_USER,
//             pass: EMAIL_PASS,
//         },
//     });

//     const emailBody = EMAIL_BODY.replace("{name}", toProperCase(name)).replace(
//         /{resetToken}/g,
//         resetToken
//     );

//     const mailOptions = {
//         from: {
//             name: EMAIL_NAME,
//             address: EMAIL_USER,
//         },
//         to: email,
//         subject: EMAIL_SUBJECT,
//         html: emailBody,
//     };

//     transporter.sendMail(mailOptions, (err) => {
//         if (err) {
//             res.status(500).json({ error: "Failed to send reset email" });
//         } else {
//             res.status(200).json({ message: "Reset email sent" });
//         }
//     });
// });

// Reset Password
// router.post("/reset-password", async (req, res) => {
//     const { token, password, newPassword } = req.body;

//     try {
//         // Verify JWT token
//         const decodedToken = jwt.verify(token, JWT_SECRET);

//         // Hashing password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         let user;
//         if (decodedToken.email !== undefined) {
//             // user was not logged in
//             const { email } = decodedToken;
//             const userFound = await UserModel.findOne({ email: email });
//             const superuserFound = await SuperuserModel.findOne({
//                 email: email,
//             });
//             const adminFound = await AdminModel.findOne({ email: email });
//             user = userFound || superuserFound || adminFound;
//         } else {
//             // user is logged in
//             const { id, role } = decodedToken;
//             let isPasswordValid;
//             if (role == "user") {
//                 user = await UserModel.findOne({ _id: id });
//                 ({ isPasswordValid } = await verifyAccount(user, password));
//             } else if (role == "therapist" || role == "educator") {
//                 user = await SuperuserModel.findOne({ _id: id });
//                 ({ isPasswordValid } = await verifyAccount(user, password));
//             } else if (role == "admin") {
//                 user = await AdminModel.findOne({ _id: id });
//                 ({ isPasswordValid } = await verifyAccount(user, password));
//             }

//             if (!isPasswordValid) {
//                 return res.status(401).json({ error: "Unauthorised" });
//             }
//         }

// Update user password
// const user = await UserModel.findOne({ email: email });
//         user.password = hashedPassword;
//         await user.save();

//         return res
//             .status(200)
//             .json({ message: "Password successfully resetted" });
//     } catch (err) {
//         if (
//             err instanceof jwt.TokenExpiredError ||
//             err instanceof jwt.JsonWebTokenError
//         ) {
//             return res.status(401).json({ error: "Invalid or expired token" });
//         }

//         return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
//     }
// });

// Get User's Role
// router.get("/role/:token", async (req, res) => {
//     const token = req.params.token;
//     try {
//         // Verify token
//         const decodedToken = jwt.verify(token, JWT_SECRET);
//         const { id, role } = decodedToken;

//         return res.status(200).json({ "role": role });
//     } catch (err) {
//         if (err instanceof jwt.JsonWebTokenError) {
//             return res.status(401).json({ error: "Invalid token" });
//         }
//         return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
//     }
// });

// /** Helper functions **/
// // Login
// async function verifyAccount(account, password) {
//     const isPasswordValid = await bcrypt.compare(password, account.password);
//     const { _id: id, role: accountRole } = account;
//     return { isPasswordValid, id, accountRole };
// }

// // User Exists
// async function userExists(email) {
//     const user = await UserModel.findOne({ email: email });
//     const superuser = await SuperuserModel.findOne({ email: email });
//     const admin = await AdminModel.findOne({ email: email });
//     if (user || superuser || admin) {
//         return user.name || superuser.name || admin.name;
//     }
//     return false;
// }

// /** Helper functions **/
// // Proper Case
// function toProperCase(str) {
//     return str.toLowerCase().replace(/(^|\s)\w/g, function (match) {
//         return match.toUpperCase();
//     });
// }

export { router as authRouter };
