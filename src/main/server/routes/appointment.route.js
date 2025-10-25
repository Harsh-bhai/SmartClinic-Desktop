import express from "express";
import {
  createAppointment,
  createAppointmentByBulk,
  getAllAppointments,
  getTodayAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  updateAppointment,
  deleteAppointment,
  deleteAppointmentsByBulk,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.post("/bulk", createAppointmentByBulk);
router.get("/", getAllAppointments);
router.get("/today", getTodayAppointments);
router.get("/:id", getAppointmentById);
router.get("/patient/:patientId", getAppointmentsByPatientId);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.post("/bulkdelete", deleteAppointmentsByBulk);

export default router;
