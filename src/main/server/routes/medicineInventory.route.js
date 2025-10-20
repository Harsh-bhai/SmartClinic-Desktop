import express from "express";
import {
  createMedicine,
  createMedicinesByBulk,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  deleteAllMedicine,
  deleteMedicineByBulk
} from "../controllers/medicineInventory.controller.js";

const router = express.Router();

router.post("/", createMedicine);
router.post("/bulk", createMedicinesByBulk);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.post("/bulkdelete", deleteMedicineByBulk);
router.delete("/all", deleteAllMedicine);

export default router;
