import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { watchRouter } from "./routes/watches.js";
import { certificateRouter } from "./routes/certificates.js";

// import { inventorySKURouter } from "./routes/inventorySKU.js";
// import { paymentsRouter } from "./routes/payments.js";
// import { wishlistRouter } from "./routes/wishlist.js";

import { PORT, MONGODB_CONNECTION } from "./constants.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

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
      maxAge: 20000,
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
      // TODO: to confirm session length
      ttl: 20000,
    }),
  })
);

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/watches", watchRouter);
app.use("/certificates", certificateRouter);

// app.use("/inventory", inventorySKURouter);
// app.use("/payments", paymentsRouter);
// app.use("/wishlist", wishlistRouter);

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
