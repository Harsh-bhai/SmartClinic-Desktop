import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";
import errorHandler from "./middlewares/errorHandler";
import { db } from "./utils/drizzle";

export const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/patients", patientRoutes);
app.get("/api/test", async (req, res) => {
  await db.insert(patients).values({
    name: "John Doe",
    age: 30,
    lifestyle: "Active",
  });
});
app.get("/api/get", (req, res) => {});

// error handler
// app.use(errorHandler);
