import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Prescription,
  createPrescriptionApi,
  getAllPrescriptionsApi,
  getPrescriptionByIdApi,
  getPrescriptionByPatientIdApi,
  updatePrescriptionApi,
  deletePrescriptionApi,
} from "./prescriptionApi";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface PrescriptionState {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}

// --------------------------------------------------
// INITIAL STATE
// --------------------------------------------------

const initialState: PrescriptionState = {
  prescriptions: [],
  selectedPrescription: null,
  loading: false,
  error: null,
};

// --------------------------------------------------
// ASYNC THUNKS
// --------------------------------------------------

// 💊 Create prescription
export const createPrescription = createAsyncThunk(
  "prescription/create",
  async (data: Prescription, { rejectWithValue }) => {
    try {
      const res = await createPrescriptionApi(data);
      return res as Prescription;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create prescription");
    }
  },
);

// 📋 Get all prescriptions
export const fetchPrescriptions = createAsyncThunk(
  "prescription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPrescriptionsApi();
      return res as Prescription[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch prescriptions");
    }
  },
);

// 🔍 Get prescription by ID
export const fetchPrescriptionById = createAsyncThunk(
  "prescription/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getPrescriptionByIdApi(id);
      return res as Prescription;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch prescription by ID");
    }
  },
);

// 🔍 Get prescriptions by patientId
export const fetchPrescriptionsByPatientId = createAsyncThunk(
  "prescription/fetchByPatientId",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const res = await getPrescriptionByPatientIdApi(patientId);
      return res as Prescription[];
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to fetch prescriptions for patient",
      );
    }
  },
);

// ✏️ Update prescription
export const updatePrescription = createAsyncThunk(
  "prescription/update",
  async ({ id, data }: { id: string; data: Prescription }, { rejectWithValue }) => {
    try {
      const res = await updatePrescriptionApi(id, data);
      return res as Prescription;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update prescription");
    }
  },
);

// ❌ Delete prescription
export const deletePrescription = createAsyncThunk(
  "prescription/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePrescriptionApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete prescription");
    }
  },
);

// --------------------------------------------------
// SLICE
// --------------------------------------------------

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setSelectedPrescription: (
      state,
      action: PayloadAction<Prescription | null>,
    ) => {
      state.selectedPrescription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by patientId
      .addCase(fetchPrescriptionsByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })

      // Fetch by ID
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPrescription = action.payload;
      })

      // Create
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.prescriptions.push(action.payload);
      })

      // Update
      .addCase(updatePrescription.fulfilled, (state, action) => {
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.prescriptions[index] = action.payload;
      })

      // Delete
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.prescriptions = state.prescriptions.filter(
          (p) => p.id !== action.payload,
        );
      });
  },
});

export const { setSelectedPrescription } = prescriptionSlice.actions;

export const prescriptionReducer = prescriptionSlice.reducer;
