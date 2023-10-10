import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  f_name: {
    type: String,
    maxlength: 255,
    required: true,
  },
  l_name: {
    type: String,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  encrypted_password: {
    type: String,
    maxlength: 255,
    required: true,
  },
  salt: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: "member",
  },
  account_lock: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export const UserModel = mongoose.model("users", UserSchema);
