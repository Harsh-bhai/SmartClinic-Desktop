import * as prescriptionService from "../services/prescription.service.js";

export async function createPrescription(req, res) {
  try {
    const body = req.body;
    if (!body || !body.patientId) {
      return res.status(400).json({ success: false, message: "patientId is required" });
    }

    const created = await prescriptionService.createPrescription(body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating visit:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getAllPrescription(req, res) {
  try {
    const all = await prescriptionService.getAllPrescriptions();
    res.status(200).json({ success: true, data: all });
  } catch (err) {
    console.error("Error fetching Prescription:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getPrescriptionsByPatient(req, res) {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ success: false, message: "patientId required" });

    const visits = await prescriptionService.getPrescriptionsByPatient(patientId);
     res.status(200).json({ success: true, data: visits });
  } catch (err) {
    console.error("Error fetching patient Prescription:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getPrescriptionById(req, res) {
  try {
    const { id } = req.params;
    const visit = await prescriptionService.getPrescriptionById(id);
    if (!visit) return res.status(404).json({ success: false, message: "Prescription not found" });

    res.status(200).json({ success: true, data: visit });
  } catch (err) {
    console.error("Error fetching Prescription:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function updatePrescription(req, res) {
  try {
    const { id } = req.params;
    const updated = await prescriptionService.updatePrescription(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Prescription not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating Prescription:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function deletePrescription(req, res) {
  try {
    const { id } = req.params;
    const result = await prescriptionService.deletePrescription(id);
     res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting Prescription:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
