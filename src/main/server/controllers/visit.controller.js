import * as visitsService from "../services/visits.service.js";

export async function createVisit(req, res) {
  try {
    const body = req.body;
    if (!body || !body.patientId) {
      return res.status(400).json({ success: false, message: "patientId is required" });
    }

    const created = await visitsService.createVisit(body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating visit:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getAllVisits(req, res) {
  try {
    const all = await visitsService.getAllVisits();
    res.json({ success: true, data: all });
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getVisitsByPatient(req, res) {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ success: false, message: "patientId required" });

    const visits = await visitsService.getVisitsByPatient(patientId);
    res.json({ success: true, data: visits });
  } catch (err) {
    console.error("Error fetching patient visits:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getVisitById(req, res) {
  try {
    const { id } = req.params;
    const visit = await visitsService.getVisitById(id);
    if (!visit) return res.status(404).json({ success: false, message: "Visit not found" });

    res.json({ success: true, data: visit });
  } catch (err) {
    console.error("Error fetching visit:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function updateVisit(req, res) {
  try {
    const { id } = req.params;
    const updated = await visitsService.updateVisit(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Visit not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating visit:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function deleteVisit(req, res) {
  try {
    const { id } = req.params;
    const result = await visitsService.deleteVisit(id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting visit:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
