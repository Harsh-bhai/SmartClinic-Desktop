// src/modules/patient/patient.controller.js
import {PatientService} from "../services/patient.service.js";

export const PatientController = {
  async create(req, res) {
    try {
      const patient = await PatientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (err) {
      console.error("❌ Create Patient Error:", err);
      res.status(500).json({ error: "Failed to create patient" });
    }
  },

  async getAll(req, res) {
    try {
      const all = await PatientService.getAllPatients();
      res.json(all);
    } catch (err) {
      console.error("❌ Get All Patients Error:", err);
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  },

  async getById(req, res) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (err) {
      console.error("❌ Get Patient By ID Error:", err);
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  },

  async update(req, res) {
    try {
      const patient = await PatientService.updatePatient(req.params.id, req.body);
      res.json(patient);
    } catch (err) {
      console.error("❌ Update Patient Error:", err);
      res.status(500).json({ error: "Failed to update patient" });
    }
  },

  async delete(req, res) {
    try {
      await PatientService.deletePatient(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("❌ Delete Patient Error:", err);
      res.status(500).json({ error: "Failed to delete patient" });
    }
  },
};
