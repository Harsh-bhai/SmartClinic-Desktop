import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.route.js";
import prescriptionRoutes from "./routes/prescription.route.js";
import prescribedMedicineRoutes from "./routes/prescribedMedicines.route.js";
import medicineInventoryRoutes from "./routes/medicineInventory.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import errorHandler from "./middlewares/errorHandler";

export const app = express();

app.use(cors({origin:"http://localhost:5173", credentials: true}));
app.use(express.json());


// routes
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescribed-medicines", prescribedMedicineRoutes);
app.use("/api/medicine-inventory", medicineInventoryRoutes);
app.use("/api/medicine-inventory", appointmentRoutes);
