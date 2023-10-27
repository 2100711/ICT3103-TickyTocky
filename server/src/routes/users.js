import express from "express";
const userRouter = express.Router();
import {
    createUser,
    getAllUsersEmails,
    getUser,
    updateUser,
    deleteUser,
} from "../controls/users.js";

import { isAuthenticated, isAdmin } from "../controls/auth.js";
import {
    logRequest,
} from "../controls/accessLogs.js";

userRouter.post("/", isAuthenticated, isAdmin, createUser, logRequest);
userRouter.get("/all-users", isAuthenticated, isAdmin, getAllUsersEmails, logRequest);
userRouter.get("/:email", isAuthenticated, getUser, logRequest); // get one user -> only available for the user that owns the account
userRouter.put("/", isAuthenticated, updateUser, logRequest); // -> only available for the user that owns the account
userRouter.delete("/", isAuthenticated, isAdmin, deleteUser, logRequest);

export { userRouter };