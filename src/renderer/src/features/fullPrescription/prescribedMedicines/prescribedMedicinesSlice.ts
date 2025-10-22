import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as prescribedMedicinesApi from "./prescribedMedicinesApi";
import { PrescribedMedicine, PrescribedMedicineUpdatePayload } from "./prescribedMedicinesApi";


export interface PrescribedMedicinesState {
  medicines: PrescribedMedicine[];
  loading: boolean;
  error: string | null;
}

const initialState: PrescribedMedicinesState = {
  medicines: [],
  loading: false,
  error: null,
};

//
// ─── ASYNC THUNKS ───────────────────────────────────────────────
//

// ✅ Fetch prescribed medicines for a prescription
export const fetchPrescribedMedicines = createAsyncThunk(
  "prescribedMedicines/fetchByPrescriptionId",
  async (prescriptionId: string, { rejectWithValue }) => {
    try {
      const data = await prescribedMedicinesApi.getPrescribedMedicineByPrescriptionId(prescriptionId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch prescribed medicines");
    }
  }
);

// ✅ Create a new prescribed medicine
export const createPrescribedMedicine = createAsyncThunk(
  "prescribedMedicines/create",
  async (
    data: {
      prescriptionId: string;
      medicineId?: string | null;
      name: string;
      dose: string;
      frequency: string[];
      duration: string;
      remarks?: string;
      timing: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const newMed = await prescribedMedicinesApi.createPrescribedMedicineApi(data);
      return newMed;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create prescribed medicine");
    }
  }
);

// ✅ Update a prescribed medicine by its ID
export const updatePrescribedMedicine = createAsyncThunk(
  "prescribedMedicines/update",
  async (
    { id, data }: { id: string; data: PrescribedMedicineUpdatePayload },
    { rejectWithValue }
  ) => {
    try {
      const updated = await prescribedMedicinesApi.updatePrescribedMedicineApi(id, data);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update prescribed medicine");
    }
  }
);

// ✅ Delete a prescribed medicine by its ID
export const deletePrescribedMedicine = createAsyncThunk(
  "prescribedMedicines/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await prescribedMedicinesApi.deletePrescribedMedicineApi(id);
      return id; // return id for easy filtering
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete prescribed medicine");
    }
  }
);

//
// ─── SLICE ──────────────────────────────────────────────────────
//

const prescribedMedicinesSlice = createSlice({
  name: "prescribedMedicines",
  initialState,
  reducers: {
    clearPrescribedMedicines: (state) => {
      state.medicines = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch ───
    builder.addCase(fetchPrescribedMedicines.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPrescribedMedicines.fulfilled, (state, action: PayloadAction<PrescribedMedicine[]>) => {
      state.loading = false;
      state.medicines = action.payload;
    });
    builder.addCase(fetchPrescribedMedicines.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ─── Create ───
    builder.addCase(createPrescribedMedicine.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPrescribedMedicine.fulfilled, (state, action: PayloadAction<PrescribedMedicine>) => {
      state.loading = false;
      state.medicines.push(action.payload);
    });
    builder.addCase(createPrescribedMedicine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ─── Update ───
    builder.addCase(updatePrescribedMedicine.fulfilled, (state, action: PayloadAction<PrescribedMedicine>) => {
      const index = state.medicines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) state.medicines[index] = action.payload;
    });

    // ─── Delete ───
    builder.addCase(deletePrescribedMedicine.fulfilled, (state, action: PayloadAction<string>) => {
      state.medicines = state.medicines.filter((m) => m.id !== action.payload);
    });
  },
});

export const { clearPrescribedMedicines } = prescribedMedicinesSlice.actions;
export const prescribedMedicinesReducer = prescribedMedicinesSlice.reducer;
