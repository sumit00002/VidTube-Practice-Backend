import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // 👈 CORS ENABLED

// MIDDLEWARES
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to VidTube!");
});

// import ROUTES

import healthcheckRoute from "./routes/healthcheck.routes.js";
import userRoute from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middlewares.js";

// routes above...



// routes

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/users", userRoute);
app.use(errorHandler);


export default app;
