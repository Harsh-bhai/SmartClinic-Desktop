import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
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

// ------------------------------
// 🔄 ASYNC THUNKS
// ------------------------------

export const createPrescription = createAsyncThunk(
  "prescription/create",
  async (data: Prescription, { rejectWithValue }) => {
    try {
      return await createPrescriptionApi(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchAllPrescriptions = createAsyncThunk(
  "prescription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPrescriptionsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchPrescriptionById = createAsyncThunk(
  "prescription/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getPrescriptionByIdApi(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchPrescriptionByPatientId = createAsyncThunk(
  "prescription/fetchByPatientId",
  async (patientId: string, { rejectWithValue }) => {
    try {
      return await getPrescriptionByPatientIdApi(patientId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updatePrescription = createAsyncThunk(
  "prescription/update",
  async (
    { id, data }: { id: string; data: Prescription },
    { rejectWithValue },
  ) => {
    try {
      return await updatePrescriptionApi(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deletePrescription = createAsyncThunk(
  "prescription/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await deletePrescriptionApi(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ------------------------------
// 📦 STATE
// ------------------------------

export interface PrescriptionState {
  list: Prescription[];
  selectedPrescription: Prescription | null;
  draft: Prescription | null; // <-- ADD THIS
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  list: [],
  selectedPrescription: null,
  draft: null,
  loading: false,
  error: null,
};

// ------------------------------
// 🧩 SLICE
// ------------------------------

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setSelectedPrescription(state, action: PayloadAction<Prescription | null>) {
      state.selectedPrescription = action.payload;
    },
    setDraftPrescription(state, action: PayloadAction<Prescription | null>) {
      state.draft = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Create
    builder.addCase(createPrescription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPrescription.fulfilled, (state, action) => {
      state.loading = false;
      state.list.push(action.payload);
      state.selectedPrescription = action.payload;
    });
    builder.addCase(createPrescription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch All
    builder.addCase(fetchAllPrescriptions.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    // Fetch by ID
    builder.addCase(fetchPrescriptionById.fulfilled, (state, action) => {
      state.selectedPrescription = action.payload;
    });

    // Fetch by patientId
    builder.addCase(fetchPrescriptionByPatientId.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    // Update
    builder.addCase(updatePrescription.fulfilled, (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;

      if (
        state.selectedPrescription &&
        state.selectedPrescription.id === action.payload.id
      ) {
        state.selectedPrescription = action.payload;
      }
    });

    // Delete
    builder.addCase(deletePrescription.fulfilled, (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.meta.arg);

      if (
        state.selectedPrescription &&
        state.selectedPrescription.id === action.meta.arg
      ) {
        state.selectedPrescription = null;
      }
    });
  },
});

// ------------------------------
// 📤 EXPORTS
// ------------------------------

export const { setSelectedPrescription, setDraftPrescription } =
  prescriptionSlice.actions;

const persistConfig = {
  key: "prescription",
  storage,
  whitelist: ["draft"],
};

export const prescriptionReducer = persistReducer(
  persistConfig,
  prescriptionSlice.reducer,
);
