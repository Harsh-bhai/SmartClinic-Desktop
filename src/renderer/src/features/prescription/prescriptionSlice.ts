import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Medicine, Patient, PrescriptionState } from "@shared/schemas/patient.schema";

const initialState: PrescriptionState = {
  activeTab: "patient",
  patient: { name: "", age: "", medicalHistory: "", lifestyle: "" },
  medicines: [],
  editingIndex: null,
};

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<"patient" | "medicines">) => {
      state.activeTab = action.payload;
    },
    updatePatient: (state, action: PayloadAction<Partial<Patient>>) => {
      state.patient = { ...state.patient, ...action.payload };
    },
    addMedicine: (state, action: PayloadAction<Medicine>) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<{ index: number; data: Medicine }>) => {
      state.medicines[action.payload.index] = action.payload.data;
    },
    deleteMedicine: (state, action: PayloadAction<number>) => {
      state.medicines = state.medicines.filter((_, i) => i !== action.payload);
    },
    setEditingIndex: (state, action: PayloadAction<number | null>) => {
      state.editingIndex = action.payload;
    },
  },
});

export const {
  setActiveTab,
  updatePatient,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  setEditingIndex,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
