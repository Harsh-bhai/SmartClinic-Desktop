import * as patientService from "../services/patient.service.js";

export async function createPatient(req, res) {
  try {
    const data = req.body;
    const patient = await patientService.createPatient(data);
    res.status(201).json({ success: true, patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getAllPatients(req, res) {
  try {
    const patients = await patientService.getAllPatients();
    res.json({ success: true, patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const updated = await patientService.updatePatient(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient: updated });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const deleted = await patientService.deletePatient(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deletePatientByBulk(req, res) {
  try {
    const deleted = await patientService.deletePatientByBulk(req.body);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, message: "Multiple Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
