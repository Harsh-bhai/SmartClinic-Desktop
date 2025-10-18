import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.route.js";
import prescriptionRoutes from "./routes/prescription.route.js";
import prescribedMedicineRoutes from "./routes/prescribedMedicines.route.js";
import medicineInventoryRoutes from "./routes/medicineInventory.route.js";
import errorHandler from "./middlewares/errorHandler";
import { db } from "./utils/drizzle";
import {patients, medicineInventory, prescribedMedicines } from "./drizzle/schema";
import { randomUUID } from "crypto";

export const app = express();

app.use(cors({origin:"http://localhost:5173", credentials: true}));
app.use(express.json());


// routes
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescribed-medicines", prescribedMedicineRoutes);
app.use("/api/medicine-inventory", medicineInventoryRoutes);
// app.get("/api/test-insert", async (req, res) => {
//   try {
//     const id = randomUUID(); // generate unique ID
//     const result = await db.insert(patients).values({
//       id,
//       name: "harsh",
//       age: 32,
//       gender: "Male",
//       phone: "24864321684",
//       address: "Delhi, India",
//     }).returning();

//     res.json({
//       success: true,
//       message: "Patient inserted successfully ✅",
//       insertedPatient: result[0],
//     });
//   } catch (error) {
//     console.error("Error inserting patient:", error);
//     res.status(500).json({ success: false, message: "Database insert failed" });
//   }
// });
// app.get("/api/test-visit", async (req, res) => {
//   try {
//     const id = randomUUID();

//     // ⚠️ Replace with an existing patientId from your DB
//     const patientId = "94f770f7-6b4a-4899-b4b1-c180ab15a9f2";

//     const result = await db.insert(visits).values({
//       id,
//       patientId,
//       reason: "Routine dental checkup",
//       examinationFindings: "Healthy gums, minor plaque buildup",
//       advice: "Regular brushing and flossing",
//       nextVisit: "2025-12-01",
//     }).returning();

//     res.json({
//       success: true,
//       message: "Visit inserted successfully ✅",
//       insertedVisit: result[0],
//     });
//   } catch (error) {
//     console.error("Error inserting visit:", error);
//     res.status(500).json({ success: false, message: "Database insert failed" });
//   }
// });
// app.get("/api/test-medicine-inventory", async (req, res) => {
//   try {
//     const id = randomUUID();

//     const result = await db.insert(medicineInventory).values({
//       id,
//       name: "Amoxicillin",
//       type: "Tablet",
//       strength: "500mg",
//       manufacturer: "Cipla Ltd",
//       stock: 200,
//       notes: "Broad-spectrum antibiotic",
//     }).returning();

//     res.json({
//       success: true,
//       message: "Medicine added to inventory ✅",
//       insertedMedicine: result[0],
//     });
//   } catch (error) {
//     console.error("Error inserting medicine into inventory:", error);
//     res.status(500).json({ success: false, message: "Database insert failed" });
//   }
// });
// app.get("/api/test-prescribed-medicine", async (req, res) => {
//   try {
//     const id = randomUUID();

//     // ⚠️ Replace with actual visitId and medicineId from your DB
//     const visitId = "74ca7c84-3403-4ded-b1ba-f96b6faab58c";
//     const medicineId = "9c69294c-e72f-4607-b00b-4b43a414ebcc";

//     const result = await db.insert(prescribedMedicines).values({
//       id,
//       visitId,
//       medicineId,
//       name: "Amoxicillin",
//       dose: "500mg",
//       frequency: JSON.stringify(["Morning", "Evening"]),
//       duration: "5 days",
//       remarks: "After food",
//     }).returning();

//     res.json({
//       success: true,
//       message: "Prescribed medicine inserted successfully ✅",
//       insertedPrescription: result[0],
//     });
//   } catch (error) {
//     console.error("Error inserting prescribed medicine:", error);
//     res.status(500).json({ success: false, message: "Database insert failed" });
//   }
// });



// error handler
// app.use(errorHandler);
