import * as appointmentService from "../services/appointment.service.js";

// 📅 Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const data = req.body;
    const result = await appointmentService.createAppointment(data);
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  } catch (error) {
    console.error("createAppointmentController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

// 📅 Create multiple appointments in bulk
export const createAppointmentByBulk = async (req, res) => {
  try {
    const dataArray = req.body;
    const result = await appointmentService.createAppointmentByBulk(dataArray);
    res.status(201).json({
      success: true,
      message: "Appointments created in bulk successfully",
      data: result,
    });
  } catch (error) {
    console.error("createAppointmentByBulkController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointments in bulk",
      error: error.message,
    });
  }
};

// 📋 Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const results = await appointmentService.getAllAppointments();
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("getAllAppointmentsController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// 📅 Get today's appointments
export const getTodayAppointments = async (req, res) => {
  try {
    const results = await appointmentService.getTodayAppointments();
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("getTodayAppointmentsController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
      error: error.message,
    });
  }
};

// 🔍 Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await appointmentService.getAppointmentById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getAppointmentByIdController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment by ID",
      error: error.message,
    });
  }
};

// 🔍 Get appointments by patient ID
export const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await appointmentService.getAppointmentsByPatientId(patientId);

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this patient",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("getAppointmentsByPatientIdController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments by patient ID",
      error: error.message,
    });
  }
};

// ✏️ Update appointment by ID
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await appointmentService.updateAppointment(id, data);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("updateAppointmentController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

// 🗑️ Delete appointment by ID
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await appointmentService.deleteAppointment(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("deleteAppointmentController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
};

// 🧹 Bulk delete appointments
export const deleteAppointmentsByBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs to delete",
      });
    }

    const result = await appointmentService.deleteAppointmentsByBulk(ids);

    res.status(200).json({
      success: true,
      message: `${result.deleted} appointments deleted successfully`,
    });
  } catch (error) {
    console.error("deleteAppointmentsByBulkController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointments in bulk",
      error: error.message,
    });
  }
};
