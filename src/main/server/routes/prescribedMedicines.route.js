import express from "express";
import {
  createPrescribedMedicine,
  getPrescribedMedicineById,
  updatePrescribedMedicine,
  deletePrescribedMedicine,
  getPrescribedMedicinesByPrescriptionId,
  getPrescribedMedicinesByMedicineId,
  updatePrescribedMedicineByPrescriptionAndMedicineId,
  deletePrescribedMedicinesByPrescriptionId,
} from "../controllers/prescribedMedicines.controller.js";

const router = express.Router();

router.post("/", createPrescribedMedicine);
router.get(
  "/prescription/:prescriptionId",
  getPrescribedMedicinesByPrescriptionId,
);
router.get("/medicine/:medicineId", getPrescribedMedicinesByMedicineId);
router.get("/:id", getPrescribedMedicineById);
router.put("/:id", updatePrescribedMedicine);
router.put(
  "/:prescriptionId/:medicineId",
  updatePrescribedMedicineByPrescriptionAndMedicineId,
);
router.delete("/:id", deletePrescribedMedicine);
router.delete(
  "/prescription/:prescriptionId",
  deletePrescribedMedicinesByPrescriptionId,
);

export default router;
