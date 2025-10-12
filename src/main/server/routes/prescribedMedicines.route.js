import express from "express";
import {
  createPrescribedMedicine,
  getAllPrescribedMedicines,
  getPrescribedMedicineById,
  updatePrescribedMedicine,
  deletePrescribedMedicine,
} from "../controllers/prescribedMedicines.controller.js";

const router = express.Router();

router.post("/", createPrescribedMedicine);
router.get("/", getAllPrescribedMedicines);
router.get("/:id", getPrescribedMedicineById);
router.put("/:id", updatePrescribedMedicine);
router.delete("/:id", deletePrescribedMedicine);

export default router;
