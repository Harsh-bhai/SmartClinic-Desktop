import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Patient,
  getAllPatientsApi,
  createPatientApi,
  updatePatientApi,
  deletePatientApi,
  deletePatientByBulkApi,
} from "../patients/patientApi";

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  selectedPatient: Patient | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  selectedPatient: null,
};

//
// ─── ASYNC THUNKS ──────────────────────────────────────────────────────────────
//

// ➕ Create new patient
export const createPatient = createAsyncThunk(
  "patients/create",
  async (data: Patient, { rejectWithValue }) => {
    try {
      const response = await createPatientApi(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to create patient");
    }
  }
);

// 📋 Get all patients
export const fetchPatients = createAsyncThunk(
  "patients/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPatientsApi();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch patients");
    }
  }
);

// ✏️ Update patient
export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, data }: { id: string; data: Partial<Patient> }, { rejectWithValue }) => {
    try {
      const response = await updatePatientApi(id, data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update patient");
    }
  }
);

// ❌ Delete patient
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePatientApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete patient");
    }
  }
);

// 🗑️ Bulk delete patients
export const deletePatientByBulk = createAsyncThunk(
  "patients/deleteBulk",
  async (ids: string[], { rejectWithValue }) => {
    try {
      await deletePatientByBulkApi(ids);
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete multiple patients");
    }
  }
);

//
// ─── SLICE ─────────────────────────────────────────────────────────────────────
//

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create
    builder.addCase(createPatient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPatient.fulfilled, (state, action) => {
      state.loading = false;
      state.patients.push(action.payload);
    });
    builder.addCase(createPatient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all
    builder.addCase(fetchPatients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    });
    builder.addCase(fetchPatients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updatePatient.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deletePatient.fulfilled, (state, action) => {
      state.loading = false;
      state.patients = state.patients.filter((p) => p.id !== action.payload);
    });

    // Bulk delete
    builder.addCase(deletePatientByBulk.fulfilled, (state, action) => {
      state.loading = false;
      state.patients = state.patients.filter(
        (p) => !action.payload.includes(p.id!)
      );
    });
  },
});

export const { setSelectedPatient } = patientSlice.actions;
export const patientReducer = patientSlice.reducer;
