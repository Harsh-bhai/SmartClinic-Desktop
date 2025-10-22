import axios from "axios";

const BASE_URL = "/api/prescribed-medicines"; // Adjust if your backend route differs

export interface PrescribedMedicine {
  id?: string;
  prescriptionId: string;
  medicineId?: string | null;
  name: string;
  dose: string;
  frequency: string[];
  duration: string;
  timing: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrescribedMedicineUpdatePayload{
    id?: string;
    name: string;
    dose: string;
    frequency: string[];
    duration: string;
    timing: string;
    remarks?: string;
  }

// ✅ 1. Create a new prescribed medicine
export async function createPrescribedMedicineApi(data: PrescribedMedicine) {
  const response = await axios.post(`${BASE_URL}`, data);
  return response.data.data;
}

// ✅ 2. Get all prescribed medicines by prescriptionId
export async function getPrescribedMedicineByPrescriptionId(
  prescriptionId: string,
) {
  const response = await axios.get(
    `${BASE_URL}/prescription/${prescriptionId}`,
  );
  return response.data.data;
}

// ✅ 3. Get all prescribed medicines by medicineId (if needed)
export async function getPrescribedMedicineByMedicineId(medicineId: string) {
  const response = await axios.get(`${BASE_URL}/medicine/${medicineId}`);
  return response.data.data;
}

// ✅ 4. Get a single prescribed medicine by its ID
export async function getPrescribedMedicineById(id: string) {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data.data;
}

// ✅ 5. Update prescribed medicine by its ID
export async function updatePrescribedMedicineApi(
  id: string,
  data: PrescribedMedicineUpdatePayload,
) {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data.data;
}

// ✅ 6. Update prescribed medicine by (prescriptionId + medicineId)
export async function updatePrescribedMedicineByPrescriptionAndMedicineId(
  prescriptionId: string,
  medicineId: string,
  data: PrescribedMedicineUpdatePayload,
) {
  const response = await axios.put(
    `${BASE_URL}/${prescriptionId}/${medicineId}`,
    data,
  );
  return response.data.data;
}

// ✅ 7. Delete prescribed medicine by its ID
export async function deletePrescribedMedicineApi(id: string) {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
}

// ✅ 8. Delete all prescribed medicines by prescriptionId
export async function deletePrescribedMedicineByPrescriptionId(
  prescriptionId: string,
) {
  const response = await axios.delete(
    `${BASE_URL}/prescription/${prescriptionId}`,
  );
  return response.data;
}
