import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPrescriptionApi,
  getAllPrescriptionsApi,
  getPrescriptionByIdApi,
  getPrescriptionByPatientIdApi,
  updatePrescriptionApi,
  deletePrescriptionApi,
  Prescription,
} from "./prescriptionApi";

// 🌀 Async Thunks
export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (data: Prescription, { rejectWithValue }) => {
    try {
      const res = await createPrescriptionApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllPrescriptions = createAsyncThunk(
  "prescriptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPrescriptionsApi();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPrescriptionById = createAsyncThunk(
  "prescriptions/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getPrescriptionByIdApi(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPrescriptionsByPatientId = createAsyncThunk(
  "prescriptions/fetchByPatientId",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const res = await getPrescriptionByPatientIdApi(patientId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updatePrescription = createAsyncThunk(
  "prescriptions/update",
  async (
    { id, data }: { id: string; data: Prescription },
    { rejectWithValue }
  ) => {
    try {
      const res = await updatePrescriptionApi(id, data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deletePrescription = createAsyncThunk(
  "prescriptions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deletePrescriptionApi(id);
      return { id, res };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🧠 Slice State
export interface PrescriptionState {
  items: Prescription[];
  selected?: Prescription | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

// 🧩 Slice Definition
const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    clearSelectedPrescription(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📥 Create
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 📦 Fetch All
      .addCase(fetchAllPrescriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔍 Fetch by ID
      .addCase(fetchPrescriptionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchPrescriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 👤 Fetch by Patient ID
      .addCase(fetchPrescriptionsByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptionsByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPrescriptionsByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✏️ Update
      .addCase(updatePrescription.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // ❌ Delete
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      });
  },
});

export const { clearSelectedPrescription } = prescriptionSlice.actions;
export const prescriptionReducer = prescriptionSlice.reducer;
