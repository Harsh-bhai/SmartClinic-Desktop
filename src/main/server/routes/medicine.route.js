import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller.js";

const router = express.Router();

// GET all medicines
router.get("/", getAllMedicines);

// GET medicine by ID
router.get("/:id", getMedicineById);

// POST new medicine
router.post("/", addMedicine);

// PUT update medicine
router.put("/:id", updateMedicine);

// DELETE medicine
router.delete("/:id", deleteMedicine);

export default router;
