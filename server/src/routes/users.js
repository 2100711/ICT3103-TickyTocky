import express from "express";
const userRouter = express.Router();
import {
  createUser,
  getAllUsersEmails,
  getUser,
  updateUser,
  deleteUser,
} from "../controls/users.js";

userRouter.post("/", createUser);
userRouter.get("/all-users", getAllUsersEmails);
userRouter.get("/:email", getUser); // get one user
userRouter.put("/", updateUser);
userRouter.delete("/", deleteUser);

export { userRouter };
