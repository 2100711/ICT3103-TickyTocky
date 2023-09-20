import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// import { authRouter } from "./routes/auth.js";
// import { scenariosRouter } from "./routes/scenarios.js";
import { userRouter } from "./routes/users.js";
// import { taskRouter } from "./routes/tasks.js";
// import { uploadRouter } from "./routes/upload.js";
// import { contactRouter } from "./routes/contact.js";
// import { requestRouter } from "./routes/request.js";

import { PORT, MONGODB_CONNECTION } from "./constants.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Routes
// app.use("/auth", authRouter);
// app.use("/scenarios", scenariosRouter);
app.use("/users", userRouter);
// app.use("/tasks", taskRouter);
// app.use("/upload", uploadRouter);
// app.use("/contact", contactRouter);
// app.use("/request", requestRouter);

mongoose.connect(MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Listen for the "connected" event
db.on("connected", () => {
  console.log("Mongoose connection is successful!");
});

// Listen for the "error" event
db.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Listen for the "disconnected" event
db.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

app.get("/", (req, res) => res.send("Dockerizing Node Application"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
