import express from "express";
import {
  createVisit,
  getAllVisits,
  getVisitsByPatient,
  getVisitById,
  updateVisit,
  deleteVisit,
} from "../controllers/visits.controller.js";

const router = express.Router();

router.post("/", createVisit);
router.get("/", getAllVisits);
router.get("/patient/:patientId", getVisitsByPatient);
router.get("/:id", getVisitById);
router.put("/:id", updateVisit);
router.delete("/:id", deleteVisit);

export default router;
