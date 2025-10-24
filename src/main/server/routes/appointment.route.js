import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  deleteAppointmentsByBulk,
  getTodayAppointments,
  createAppointmentByBulk
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.post("/bulk", createAppointmentByBulk);
router.get("/", getAllAppointments);
router.get("/today", getTodayAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.post("/bulkdelete", deleteAppointmentsByBulk);

export default router;
