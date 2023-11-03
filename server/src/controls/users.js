import { UserModel } from "../models/Users.js";
import { CertModel } from "../models/Certs.js";
import { deleteWatch } from "./watches.js";
import { unlockAccount, userExists } from "./auth.js";
import bcrypt from "bcrypt";

// Middleware to handle errors
const handleError = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};

const createUser = async (req, res, next) => {
  try {
const admin = await UserModel.findOne({ email: req.session.user.email, role: "admin" });
    if (!admin) {
res.status(401).json({
      success: false,
      message: `Unauthorized`,
    });
    } else {
          req.user_id = admin._id;
    next();
    }
    const { f_name, l_name, password, email, account_lock, role } = req.body;
    if (await userExists(email))
      return res.status(409).json({
        success: false,
        error: "User already exist.",
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
      account_lock: account_lock,
      role: role,
      // salt: saltedText,
    });

    await newUser.save();

    if (!newUser) {
      handleError(res, "An error occurred");
    }

    res.status(200).json({
      success: true,
      message: `User ${newUser.f_name} ${newUser.l_name} created successfully.`,
    });
  } catch (error) {
    handleError(res, "An error occurred");
  }
};

const getAllUsersEmails = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("email");
    const emails = users.map((user) => user.email);

    res.status(200).json({
      success: true,
      message: "Get all user emails",
      emails,
    });
  } catch (error) {
    handleError(res, "An error occurred");
  }
};

const getUser = async (req, res, next) => {
  try {
    const requested = await UserModel.findOne({ email: req.session.user.email});
          req.user_id = requested._id;
    next();
    const { email } = req.params;
    const user = await UserModel.findOne({ email: email }).select(
      "-_id -encrypted_password"
    );

    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "An error occurred");
  }
};

const updateUser = async (req, res, next) => {
  const { f_name, l_name, email } = req.body;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name } },
      { new: true }
    );

    req.user_id = updatedUser._id;
    next();

    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "An error occurred");
  }
};

const updateUserAsAdmin = async (req, res, next) => {
  const { f_name, l_name, email, account_lock, email_verified, role } =
    req.body;
  try {
    const admin = await UserModel.findOne({ email: req.session.user.email, role: "admin" });
    if (!admin) {
res.status(401).json({
      success: false,
      message: `Unauthorized`,
    });
    } else {
          req.user_id = admin._id;
    next();
    }
    const currentUser = await UserModel.findOne({ email });

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name, account_lock, email_verified, role } },
      { new: true }
    );

    if (updatedUser) {
      // if previously, user's account was locked and now it's unlocked, reset login attempts
      if (currentUser.account_lock && !updatedUser.account_lock) {
        await unlockAccount(updatedUser._id, req.ip);
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "An error occurred");
  }
};

const deleteUser = async (req, res, next) => {
  const session = await CertModel.startSession();
  const { email } = req.body;
  try {

          const admin = await UserModel.findOne({ email: req.session.user.email, role: "admin" });
    if (!admin) {
res.status(401).json({
      success: false,
      message: `Unauthorized`,
    });
    } else {
          req.user_id = admin._id;
    next();
    }
    const certs = await CertModel.find({ user_email: email });
    session.startTransaction();
    if (certs && certs.length > 0) {
      for (const cert of certs) {
        await deleteWatch(cert.watch_id, session);
      }
      const user_email = certs[0].user_email;
      await CertModel.deleteMany({ user_email: user_email }, { session });
    }

    const result = await UserModel.deleteOne({ email });

    await session.commitTransaction();
    session.endSession();

    if (result.deletedCount === 1) {

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    handleError(res, "An error occurred");
  }
};

export {
  createUser,
  getAllUsersEmails,
  getUser,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
};
