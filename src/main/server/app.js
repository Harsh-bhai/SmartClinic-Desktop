import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";
import errorHandler from "./middlewares/errorHandler";
import { db } from "./utils/drizzle";
import {patients } from "./drizzle/schema";
import { randomUUID } from "crypto";

export const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/patients", patientRoutes);
app.get("/api/test-insert", async (req, res) => {
  try {
    const id = randomUUID(); // generate unique ID
    const result = await db.insert(patients).values({
      id,
      name: "harsh",
      age: 32,
      gender: "Male",
      phone: "24864321684",
      address: "Delhi, India",
    }).returning();

    res.json({
      success: true,
      message: "Patient inserted successfully ✅",
      insertedPatient: result[0],
    });
  } catch (error) {
    console.error("Error inserting patient:", error);
    res.status(500).json({ success: false, message: "Database insert failed" });
  }
});



// error handler
// app.use(errorHandler);
