import express from "express";
import {
  createPrescription,
  getAllPrescription,
  getPrescriptionsByPatient,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";

const router = express.Router();

router.post("/", createPrescription);
router.get("/", getAllPrescription);
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/:id", getPrescriptionById);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

export default router;
