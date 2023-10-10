import express from "express";
const watchRouter = express.Router();
import {
  createWatch,
  getAllWatches,
  getWatch,
  updateWatch,
  deleteWatch,
} from "../controls/watches.js";

watchRouter.post("/", createWatch);
watchRouter.get("/", getAllWatches);
watchRouter.get("/:watchID", getWatch); // get one user
watchRouter.put("/", updateWatch);
watchRouter.delete("/", deleteWatch);

export { watchRouter };
