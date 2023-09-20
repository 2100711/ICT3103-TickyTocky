import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {type: String, required: true},
    // role: { type: String, required: true },
    // dob: { type: Date, required: true },
    // gender: { type: String, required: true },
    // issue: { type: [String], default: undefined },
    // therapistName: { type: String },
    // therapistEmail: { type: String },
    // currentFolder: { type: String },
    // therapistRequests: { type: [String] },
    // prevTherapists: [
    //     {
    //         email: { type: String },
    //         folderId: { type: String },
    //     },
    // ],
});

export const UserModel = mongoose.model("users", UserSchema);
