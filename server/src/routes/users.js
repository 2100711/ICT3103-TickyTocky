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

userRouter.post("/", isAuthenticated, isAdmin, createUser);
userRouter.get("/all-users", isAuthenticated, isAdmin, getAllUsersEmails);
userRouter.get("/:email", isAuthenticated, getUser); // get one user -> only available for the user that owns the account
userRouter.put("/", isAuthenticated, updateUser); // -> only available for the user that owns the account
userRouter.delete("/", isAuthenticated, isAdmin, deleteUser);

export { userRouter };
