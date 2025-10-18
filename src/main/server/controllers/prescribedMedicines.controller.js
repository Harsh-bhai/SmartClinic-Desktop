import * as prescribedMedicinesService from "../services/prescribedMedicines.service.js";

/**
 * ✅ Create a new prescribed medicine
 */
export async function createPrescribedMedicine(req, res) {
  try {
    const data = req.body;
    const result = await prescribedMedicinesService.createPrescribedMedicine(data);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error creating prescribed medicine:", error);
    return res.status(500).json({ success: false, message: "Failed to create prescribed medicine" });
  }
}

/**
 * ✅ Get prescribed medicines by prescriptionId
 */
export async function getPrescribedMedicinesByPrescriptionId(req, res) {
  try {
    const { prescriptionId } = req.params;
    const result = await prescribedMedicinesService.getPrescribedMedicinesByPrescriptionId(prescriptionId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error fetching prescribed medicines:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch prescribed medicines" });
  }
}

/**
 * ✅ Get prescribed medicines by medicineId
 */
export async function getPrescribedMedicinesByMedicineId(req, res) {
  try {
    const { medicineId } = req.params;
    const result = await prescribedMedicinesService.getPrescribedMedicinesByMedicineId(medicineId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error fetching prescribed medicines by medicineId:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch prescribed medicines" });
  }
}

/**
 * ✅ Get a single prescribed medicine by its ID
 */
export async function getPrescribedMedicineById(req, res) {
  try {
    const { id } = req.params;
    const result = await prescribedMedicinesService.getPrescribedMedicineById(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Prescribed medicine not found" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error fetching prescribed medicine:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch prescribed medicine" });
  }
}

/**
 * ✅ Update prescribed medicine by ID
 */
export async function updatePrescribedMedicine(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await prescribedMedicinesService.updatePrescribedMedicine(id, data);
    if (!result) {
      return res.status(404).json({ success: false, message: "Prescribed medicine not found" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error updating prescribed medicine:", error);
    return res.status(500).json({ success: false, message: "Failed to update prescribed medicine" });
  }
}

/**
 * ✅ Update prescribed medicine by prescriptionId + medicineId
 */
export async function updatePrescribedMedicineByPrescriptionAndMedicineId(req, res) {
  try {
    const { prescriptionId, medicineId } = req.params;
    const data = req.body;
    const result = await prescribedMedicinesService.updatePrescribedMedicineByPrescriptionAndMedicineId(
      prescriptionId,
      medicineId,
      data
    );
    if (!result) {
      return res.status(404).json({ success: false, message: "Prescribed medicine not found" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error updating prescribed medicine by IDs:", error);
    return res.status(500).json({ success: false, message: "Failed to update prescribed medicine" });
  }
}

/**
 * ✅ Delete prescribed medicine by ID
 */
export async function deletePrescribedMedicine(req, res) {
  try {
    const { id } = req.params;
    const result = await prescribedMedicinesService.deletePrescribedMedicine(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error deleting prescribed medicine:", error);
    return res.status(500).json({ success: false, message: "Failed to delete prescribed medicine" });
  }
}

/**
 * ✅ Delete all prescribed medicines for a given prescriptionId
 */
export async function deletePrescribedMedicinesByPrescriptionId(req, res) {
  try {
    const { prescriptionId } = req.params;
    const result = await prescribedMedicinesService.deletePrescribedMedicinesByPrescriptionId(prescriptionId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error deleting all prescribed medicines:", error);
    return res.status(500).json({ success: false, message: "Failed to delete prescribed medicines" });
  }
}
