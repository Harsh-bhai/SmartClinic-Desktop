import * as prescribedMedicineService from "../services/prescribedMedicines.service.js";

export async function createPrescribedMedicine(req, res) {
  try {
    const { visitId, name, dose, frequency, duration } = req.body;

    if (!visitId || !name || !dose || !frequency || !duration) {
      return res.status(400).json({
        success: false,
        message: "visitId, name, dose, frequency, and duration are required",
      });
    }

    const created = await prescribedMedicineService.createPrescribedMedicine(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating prescribed medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getAllPrescribedMedicines(req, res) {
  try {
    const { visitId } = req.query;
    const medicines = await prescribedMedicineService.getAllPrescribedMedicines(visitId);
    res.json({ success: true, data: medicines });
  } catch (err) {
    console.error("Error fetching prescribed medicines:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getPrescribedMedicineById(req, res) {
  try {
    const { id } = req.params;
    const medicine = await prescribedMedicineService.getPrescribedMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Prescribed medicine not found" });
    }

    res.json({ success: true, data: medicine });
  } catch (err) {
    console.error("Error fetching prescribed medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updatePrescribedMedicine(req, res) {
  try {
    const { id } = req.params;
    const updated = await prescribedMedicineService.updatePrescribedMedicine(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Prescribed medicine not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating prescribed medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deletePrescribedMedicine(req, res) {
  try {
    const { id } = req.params;
    const result = await prescribedMedicineService.deletePrescribedMedicine(id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting prescribed medicine:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
