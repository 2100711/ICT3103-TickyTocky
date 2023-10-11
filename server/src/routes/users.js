import express from "express";
const userRouter = express.Router();
import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} from "../controls/users.js";

userRouter.post("/", createUser);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/:email", getUser); // get one user
userRouter.put("/", updateUser);
userRouter.delete("/", deleteUser);

export { userRouter };