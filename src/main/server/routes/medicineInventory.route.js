import express from "express";
import {
  createMedicine,
  createMedicinesByBulk,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineInventory.controller.js";

const router = express.Router();

router.post("/", createMedicine);
router.post("/bulk", createMedicinesByBulk);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
