import { Router } from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  deletePatientByBulk
} from "../controllers/patient.controller.js";

const router = Router();

router.post("/", createPatient);      // ➕ Add new patient
router.get("/", getAllPatients);      // 📋 Get all patients
router.get("/:id", getPatientById);   // 🔍 Get single patient
router.put("/:id", updatePatient);    // ✏️ Update patient
router.delete("/:id", deletePatient); // ❌ Delete patient
router.post("/bulkdelete", deletePatientByBulk); // ❌ Delete patient

export default router;
