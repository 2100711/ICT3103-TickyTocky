import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { UserModel } from "../models/Users.js";
import { OtpModel } from "../models/Otp.js";
import sanitize from "mongo-sanitize";

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
    checkCSRFTokenSTP(req, res, next);
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

const generateSecureToken = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

const checkAuth = async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).lean();

  if (!user) {
    return res.status(201).json({
      email: req.session.user.email,
      success: false,
      message: "An error occurred.",
      role: "",
    });
  }

  console.log(user._id);

  req.user_id = user._id;
  next();

  return res.status(201).json({
    email: req.session.user.email,
    success: true,
    message: "User is authenticated.",
    role: user.role,
  });
};

const register = async (req, res, next) => {
  const { f_name, l_name, email, password } = req.body;
  const sanitizedEmail = sanitize(email);
  const sanitizedFName = sanitize(f_name);
  const sanitizedLName = sanitize(l_name);
  const sanitizedPassword = sanitize(password);

  try {
    if (await userExists(email))
      return res.status(409).json({
        success: false,
        error: "User already exist, please login instead.",
      });

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
    // Create new user
    const newUser = new UserModel({
      f_name: sanitizedFName,
      l_name: sanitizedLName,
      email: sanitizedEmail,
      encrypted_password: hashedPassword,
      // salt: saltedText,
    });

    req.isRegister = true;
    const CSRFverified = checkCSRFTokenSTP(req, res); // check if csrf token exist
    if (!CSRFverified.result) {
      return res
        .status(401)
        .json({ success: false, message: CSRFverified.message });
    }

    await newUser.save();

    req.user_id = newUser._id;
    next();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (err) {
    console.log("ERRORRR", err);
    return res.status(500).json({ success: false, error: err });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = sanitize(email);
    const sanitizedPassword = sanitize(password);
    if (!sanitizedEmail || !sanitizedPassword) {
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
        message: "User is already logged in",
      });
    }

    req.session.user = {
      email,
    };

    await req.session.save();

    // console.log("req.session.user", req.session.user);

    req.isLogin = true;
    const CSRFverified = checkCSRFTokenSTP(req, res); // check if csrf token exist
    if (!CSRFverified.result) {
      return res
        .status(401)
        .json({ success: false, message: CSRFverified.message });
    }

    req._id = user._id;
    req.attemptSuccess = true;
    next();

    return res
      .status(200)
      .json({ success: true, message: "Login successful.", role: user.role });
  } catch (error) {
    res.status(500);
    console.error(error);
    next();
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const logout = async (req, res, next) => {
  req.session.destroy(); // Destroy the session on the server side
  res.clearCookie("CSRFToken"); // Clear the CSRFToken cookie
  res.cookie("CSRFToken", "", { expires: new Date(0) }); // Set the cookie to expire immediately
  return res.status(200).json({ success: true, message: "Logged out." });
};

const generateOTP = async (req, res, next) => {
  const { email } = req.body;
  const sanitizedEmail = sanitize(email);
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    // TODO: check if email exist in database
    const user = await UserModel.findOne({ email: sanitizedEmail }).lean();
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist." });
    }
    const isOtpExist = await OtpModel.findOne({ user_email: email });
    if (isOtpExist) {
      const currentTime = new Date();
      const storedTime = isOtpExist.timestamps;
      const timeDiff = currentTime.getTime() - storedTime.getTime();
      const minutesLeft = Math.floor((600000 - timeDiff) / 60000); // 180000ms is 3 minutes // zaf: change back to 180000
      return res.status(200).json({
        success: false,
        message: `Please wait ${minutesLeft} minutes to generate a new OTP.`,
      });
    }

    const token = generateSecureToken(32);

    const doc = await OtpModel.create({
      user_email: email,
      token: token,
    });

    const send = await emailToUser(email, token);

    if (!send.success) {
      return res.status(500).json({ success: false, message: send.message });
    }
    req.user_id = user._id;
    next();
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
  <!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3498db;
            color: #fff;
            text-align: center;
            padding: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
        }
        .card {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .button {
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            display: inline-block;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #277dbb;
        }
        .footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="../img/log.png" alt="TickyTocky" width="150">
        </div>
        <div class="card">
            <h2>TickyTocky Password Reset</h2>
            <p>We heard that you lost your TickyTocky password. Sorry about that!</p>
            <p>But don’t worry! You can use the following button to reset your password:</p>
            <p class="reset-link">
                <a class="button" href="https://gracious-kare.cloud/resetpassword?t=${token}" style="color: #fff;">Reset your password</a>
            </p>
            <p>If you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit:</p>
            <a href="https://gracious-kare.cloud/forgotpassword">https://gracious-kare.cloud//forgotpassword</a>
            <p>Thanks,</p>
            <p>The TickyTocky Team </p>
        </div>
        <p>You're receiving this email because a password reset was requested for your account.</p>
        <div class="footer">
            &copy; 2023 TickyTocky. All rights reserved.
        </div>
    </div>
</body>
</html>
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


const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const otpRecord = await OtpModel.findOne({ token: token });
    const email = otpRecord.user_email;
    const sanitizedEmail = sanitize(email);

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

    const isOtpExist = await OtpModel.findOne({ user_email: sanitizedEmail });
    if (isOtpExist.is_used) {
      if (isOtpExist) {
        const currentTime = new Date();
        const storedTime = isOtpExist.timestamps;
        const timeDiff = currentTime.getTime() - storedTime.getTime();
        const minutesLeft = Math.floor((180000 - timeDiff) / 60000); // 180000ms is 3 minutes // zaf: change back to 180000
        return res.status(200).json({
          success: false,
          message: `Please wait ${minutesLeft} minutes to generate a new OTP.`,
        });
      }
    }

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (await bcrypt.compare(password, user.encrypted_password)) {
      return res.status(200).json({
        success: false,
        message: "Old and new password cannot be the same.",
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { encrypted_password: hashedPassword, account_lock: false } },
      { new: true }
    );

    await unlockAccount(updatedUser._id, req.ip);

    if (updatedUser) {
      req.user_id = user._id;
      next();
      await OtpModel.findOneAndUpdate(
        { user_email: sanitizedEmail },
        { $set: { is_used: true } },
        { new: true }
      );
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

const updatePassword = async (req, res, next) => {
  const { email, password } = req.body;
  const sanitizedEmail = sanitize(email);
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    const user = await UserModel.findOne({ email: sanitizedEmail });
    req.user_id = user._id;
    next();
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist." });
    }

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (await bcrypt.compare(password, user.encrypted_password)) {
      return res.status(200).json({
        success: false,
        message: "Old and new password cannot be the same.",
      });
    }

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

const generateCSRFToken = async (req, res, next) => {
  try {
    const data = crypto.randomBytes(36).toString("base64"); //Generates pseudorandom data. The size argument is a number indicating the number of bytes to generate.
    const existingCSRFToken = req.cookies.CSRFToken;
    if (existingCSRFToken) {
      res.clearCookie("CSRFToken");
    }
    res.cookie("CSRFToken", data, { httpOnly: true });
    req.session.csrfToken = data; // Assigns a token parameter to the session.
    console.log("GENERATECSRFTOKEN", data);
    console.log("ISCSRFSETINSESSION", req.session.csrfToken);
    res.status(200).json({
      success: true,
      message: "token created",
    });
  } catch (e) {
    res.status(500).json({ result: false, message: e.message });
    return;
  }
};

const checkCSRFTokenSTP = (req, res) => {
  try {
    const sessionUser = req.session.user;
    const sessionCsrfToken = req.session.csrfToken;
    const requestCsrfToken = req.cookies.CSRFToken; // The token sent within the request header.

    console.log("REQUESTCSRFTOKEN", requestCsrfToken);
    console.log("sessionCsrfToken", sessionCsrfToken);
    console.log("sessionUser", sessionUser);

    if (req.isRegister) {
      // session.user is not needed for register
      delete req.isRegister;
      if (!requestCsrfToken || !sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Token has not been provided.",
        };
      }
      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Invalid token.",
        };
      }
      return { result: true };
    } else if (req.isLogin) {
      // cant return json here because the login function will try to return a second time in the login function
      // so we return an object instead and let the login function handle it
      delete req.isLogin;
      if (!requestCsrfToken || !sessionCsrfToken || !sessionUser) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Token has not been provided.",
        };
      }

      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        res.clearCookie("CSRFToken");
        res.cookie("CSRFToken", "", { expires: new Date(0) });
        return {
          result: false,
          message: "Invalid token.",
        };
      }
      return { result: true };
    } else {
      if (!requestCsrfToken || !sessionCsrfToken || !sessionUser) {
        if (sessionUser) {
          req.session.destroy();
        }
        return res.status(401).json({
          result: false,
          message: "Token has not been provided.",
        });
      }

      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        res.clearCookie("CSRFToken");
        res.cookie("CSRFToken", "", { expires: new Date(0) });
        return res.status(401).json({
          result: false,
          message: "Invalid token.",
        });
      }
    }
  } catch (e) {
    return res
      .status(500)
      .json({ result: false, message: "An error occurred" });
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
  // verifyOTP,
  // timeLeftOTP,
  resetPassword,
  updatePassword,
  generateCSRFToken,
  checkCSRFTokenSTP,
};
