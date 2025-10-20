import * as medicineService from "../services/medicineInventory.service.js";

export async function createMedicine(req, res) {
  try {
    const created = await medicineService.createMedicine(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function createMedicinesByBulk(req, res) {
  try {
    const created = await medicineService.createMedicinesByBulk(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getAllMedicines(req, res) {
  try {
    const medicines = await medicineService.getAllMedicines();
    res.json({ success: true, data: medicines });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMedicineById(req, res) {
  try {
    const { id } = req.params;
    const medicine = await medicineService.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    res.json({ success: true, data: medicine });
  } catch (err) {
    console.error("Error fetching medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateMedicine(req, res) {
  try {
    const { id } = req.params;
    const updated = await medicineService.updateMedicine(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteMedicine(req, res) {
  try {
    const { id } = req.params;
    await medicineService.deleteMedicine(id);
    return res.status(200).json({ success: true, message: "Medicine Deleted" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export async function deleteMedicineByBulk(req, res) {
  try {
    await medicineService.deleteMedicineByBulk(req.body);
    return res.status(200).json({ success: true, message: "Multiple Medicine Deleted" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteAllMedicine(req, res) {
  try {
    await medicineService.deleteAllMedicine();
    return res.status(200).json({ success: true, message: "All Medicine Deleted" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
