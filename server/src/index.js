import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import crypto from "crypto";
import rateLimit from "express-rate-limit"; //added
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { certRouter } from "./routes/certs.js";

import { PORT, MONGODB_CONNECTION } from "./constants.js";

const app = express();

// Helmet middleware for securing HTTP headers
app.use(
  // sets X-Content-type-options: nosniff (by default)
  // sets X-DNS-prefetch-control: off (by default)
  // sets X-Permitted-Cross-Domain-Policies: none (by default)
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      },
    },
    // Deny X-Frame-Options
    xFrameOptions: { action: "deny" },

    // HSTS max age; included subdomains
    strictTransportSecurity: {
      maxAge: 31536000, //set to one year
    },
  })
);

// For Content Security Policy
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

// Cache-Control middleware
app.use((req, res, next) => {
  // Set Cache-Control directives in the HTTP response
  res.setHeader("Cache-Control", "no-cache");
  next();
});

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
      secure: false, // Set to true for HTTPS
      httpOnly: true,
      signed: true,
      sameSite: "strict", // Helps mitigate CSRF attacks
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      client: db.getClient(),
      crypto: {
        secret: "squirrel", // TO BE CHANGED: should also be stored in an environment variable rather than being hard-coded.
      },
      autoRemove: "interval",
      autoRemoveInterval: 1, // checks every 1 minute to delete sessions that have expired
      ttl: 30 * 60, // sessions last for 30 minutes and session length will be added by 30 from current time if user interacts with backend server
    }),
  })
);

app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use(apiLimiter); // Apply rate limiter middleware to all routes

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/certs", certRouter);

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
