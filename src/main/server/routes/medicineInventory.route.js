import express from "express";
import {
  createMedicine,
  createMedicinesByBulk,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineInventory.controller.js";
import { deleteAllMedicine, deleteMedicineByBulk } from "../services/medicineInventory.service.js";

const router = express.Router();

router.post("/", createMedicine);
router.post("/bulk", createMedicinesByBulk);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.post("/bulk", deleteMedicineByBulk);
router.delete("/all", deleteAllMedicine);

export default router;
