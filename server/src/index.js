import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import rateLimit from "express-rate-limit"; //added

import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { certRouter } from "./routes/certs.js";
import { serialRouter } from "./routes/serial.js";

import { PORT, MONGODB_CONNECTION } from "./constants.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Comment this out if you are using nginx
mongoose.connect(MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Sessions
app.use(
    session({
        secret: "secret-key-from-env",
        cookie: {
            httpOnly: true,
            signed: true,
        },
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            client: db.getClient(),
            crypto: {
                secret: "squirrel",
            },
            autoRemove: "interval",
            autoRemoveInterval: 1, // checks every 1 minute to delete sessions that have expired
            ttl: 5 * 60, // sessions last for 5 minutes and session length will be added by 5 from current time if user interacts with backend server
        }),
    })
);

const apiLimiter = rateLimit({
    windowMs: 1 * 1000, // 1 second
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later."
});

app.use(apiLimiter); // Apply rate limiter middleware to all routes

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/certs", certRouter);
app.use("/serial", certRouter);

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

app.get("/test", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "no session" });
    }

    return res.status(200).json({ message: req.session });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));