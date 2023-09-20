import express from "express";
const userRouter = express.Router();
import { createUser } from "../controls/users.js";

userRouter.post("/", createUser);

export { userRouter };
