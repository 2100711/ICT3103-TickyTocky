import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import nodemailer from "nodemailer";

import { UserModel } from "../models/Users.js";
// import { SuperuserModel } from "../models/Superusers.js";
// import { AdminModel } from "../models/Admins.js";

// import {
//     JWT_SECRET,
//     EMAIL_NAME,
//     EMAIL_USER,
//     EMAIL_PASS,
//     EMAIL_SUBJECT,
//     EMAIL_BODY,
//     INTERNAL_SERVER_ERROR,
// } from "../constants.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const {
        fname,
        lname,
        email,
        password,
        address,
        // dob,
        // gender,
        // issue,
        // therapistName,
        // therapistEmail,
    } = req.body;
    console.log(fname, email);
    try {
        // Checking if user exists
        // if (await userExists(email)) {
        //     return res.status(409).json({ error: "User already exists" });
        // }

        // // Hashing password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            fname: fname,
            lname: lname,
            email: email,
            password: password,
            address: address,
            // role: "user",
            // dob: dob,
            // gender: gender,
            // issue: issue,
        });
        console.log(newUser);
        await newUser.save();

        return res
            .status(201)
            .json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
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
