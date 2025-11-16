import axios from "axios";

const BASE_URL = "http://localhost:3000/api/prescription"; // adjust if needed

export interface Prescription {
  id?: string;
  patientId?: string;
  appointmentId?: string;
  complain?: string;
  symptoms?: string;
  notes: string;
  medicalHistory?: string;
  vitals: {
    temperature?: string;
    pulseRate?: string;
    oxygenSaturation?: string;
    bloodPressure?: string;
  };
  examinationFindings: string;
  advice: string;
  nextVisit: string;
}


// 💊 Create a prescribed medicine
export const createPrescriptionApi = async (data: Prescription) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

// 📋 Get all prescribed medicines
export const getAllPrescriptionsApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};


// 🔍 Get prescription by ID
export const getPrescriptionByIdApi = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};


// 🔍 Get prescriptions by patientId
export const getPrescriptionByPatientIdApi = async (patientId: string) => {
  const response = await axios.get(`${BASE_URL}/patient/${patientId}`);
  return response.data;
};

// ✏️ Update prescription
export const updatePrescriptionApi = async (
  id: string,
  data: Prescription
) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// ❌ Delete prescription
export const deletePrescriptionApi = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
