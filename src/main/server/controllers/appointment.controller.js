import * as appointmentService from "../services/appointment.service.js";

// ✅ Create new appointment
export async function createAppointment(req, res) {
  try {
    const data = req.body;
    const appointment = await appointmentService.createAppointment(data);
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
}

export async function createAppointmentByBulk(req, res) {
  try {
    const data = req.body;
    const appointment = await appointmentService.createAppointmentByBulk(data);
    res.status(201).json({
      success: true,
      message: "Multiple Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
}

// 📋 Get all appointments
export async function getAllAppointments(req, res) {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
}

// 📅 Get today's appointments
export async function getTodayAppointments(req, res) {
  try {
    const appointments = await appointmentService.getTodayAppointments();
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
      error: error.message,
    });
  }
}

// 🔍 Get single appointment by ID
export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
}

// ✏️ Update appointment
export async function updateAppointment(req, res) {
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
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
}

// ❌ Delete appointment
export async function deleteAppointment(req, res) {
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
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
}

// 🧹 Delete appointments in bulk
export async function deleteAppointmentsByBulk(req, res) {
  try {
    const { ids } = req.body; // expects { ids: ["id1", "id2", ...] }

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body. Expected 'ids' array.",
      });
    }

    await appointmentService.deleteAppointmentsByBulk(ids);
    res.status(200).json({
      success: true,
      message: "Appointments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointments in bulk:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointments",
      error: error.message,
    });
  }
}
