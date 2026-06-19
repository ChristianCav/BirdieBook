import express from "express";
import cors from "cors";

import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import roundRoutes from "./routes/roundRoutes";
import roundHolesRoutes from "./routes/roundHolesRoutes";
import courseRoutes from "./routes/courseRoutes";
import courseHolesRoutes from "./routes/courseHolesRoutes";
import teeSetRoutes from "./routes/teeSetRoutes";
import teeSetHolesRoutes from "./routes/teeSetHolesRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ complete: true });
});

app.use("/api/users", userRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/roundHoles", roundHolesRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courseHoles", courseHolesRoutes);
app.use("/api/teeSets", teeSetRoutes);
app.use("/api/teeSetHoles", teeSetHolesRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
