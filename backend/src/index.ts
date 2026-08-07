import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import roundRoutes from "./routes/roundRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: ENV.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/courses", courseRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
