import { UserModel } from "../models/Users.js";
import { CertModel } from "../models/Certs.js";
import { deleteWatch } from "./watches.js";

// Middleware to handle errors
const handleError = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};

const createUser = async (req, res) => {
  try {
    const { f_name, l_name, password, email } = req.body;
    const user = await UserModel.create({
      email,
      f_name,
      l_name,
      encrypted_password: password,
    });

    res.status(200).json({
      success: true,
      message: `User ${user.f_name} ${user.l_name} created`,
      email: user.email,
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

const getUser = async (req, res) => {
  try {
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

const updateUser = async (req, res) => {
  const { f_name, l_name, email } = req.body;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name } },
      { new: true }
    );

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

const updateUserAsAdmin = async (req, res) => {
  const { f_name, l_name, email, account_lock, email_verified, role } =
    req.body;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name, account_lock, email_verified, role } },
      { new: true }
    );

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

const deleteUser = async (req, res) => {
  const session = await CertModel.startSession();
  const { email } = req.body;
  try {
    const certs = await CertModel.find({ user_email: email });
    session.startTransaction();
    if (certs && certs.length > 0) {
      for (const cert of certs) {
        console.log("CERT: ", cert);
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
    console.log("ERROERRR", error);
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
