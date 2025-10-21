import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllMedicinesApi,
  getMedicineByIdApi,
  createMedicineApi,
  updateMedicineApi,
  deleteMedicineApi,
  createMedicinesByBulkApi,
  Medicine,
  deleteMedicineByBulkApi,
  deleteAllMedicinesApi,
} from "@/features/medicineInventory";

interface MedicineInventoryState {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicineInventoryState = {
  medicines: [],
  selectedMedicine: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllMedicines = createAsyncThunk(
  "medicineInventory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllMedicinesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch medicines",
      );
    }
  },
);

export const fetchMedicineById = createAsyncThunk(
  "medicineInventory/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getMedicineByIdApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch medicine",
      );
    }
  },
);

export const createMedicine = createAsyncThunk(
  "medicineInventory/create",
  async (medicineData: Medicine, { rejectWithValue }) => {
    try {
      const response = await createMedicineApi(medicineData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to create medicine",
      );
    }
  },
);

export const createMedicinesByBulk = createAsyncThunk(
  "medicineInventory/createBulk",
  async (medicineArray: Medicine[], { rejectWithValue }) => {
    try {
      const response = await createMedicinesByBulkApi(medicineArray);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to create medicines array",
      );
    }
  },
);

export const updateMedicine = createAsyncThunk(
  "medicineInventory/update",
  async (
    { id, data }: { id: string; data: Medicine },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateMedicineApi(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update medicine",
      );
    }
  },
);

export const deleteMedicine = createAsyncThunk(
  "medicineInventory/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMedicineApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete medicine",
      );
    }
  },
);

export const deleteMedicineByBulk = createAsyncThunk(
  "medicineInventory/deleteBulk",
  async (data: string[], { rejectWithValue }) => {
    try {
      await deleteMedicineByBulkApi(data!);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete medicine",
      );
    }
  },
);

export const deleteAllMedicines = createAsyncThunk(
  "medicineInventory/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteAllMedicinesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete medicine",
      );
    }
  },
);

// Slice
const medicineInventorySlice = createSlice({
  name: "medicineInventory",
  initialState,
  reducers: {
    setSelectedMedicine: (state, action: PayloadAction<Medicine | null>) => {
      state.selectedMedicine = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllMedicines.fulfilled,
        (state, action: PayloadAction<Medicine[]>) => {
          state.loading = false;
          state.medicines = action.payload;
        },
      )
      .addCase(fetchAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by ID
      .addCase(fetchMedicineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMedicineById.fulfilled,
        (state, action: PayloadAction<Medicine>) => {
          state.loading = false;
          state.selectedMedicine = action.payload;
        },
      )
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create single
      .addCase(createMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMedicine.fulfilled,
        (state, action: PayloadAction<Medicine>) => {
          state.loading = false;
          state.medicines.push(action.payload);
        },
      )
      .addCase(createMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create multiple
      .addCase(createMedicinesByBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMedicinesByBulk.fulfilled,
        (state, action: PayloadAction<Medicine[]>) => {
          state.loading = false;
          state.medicines.push(...action.payload);
        },
      )
      .addCase(createMedicinesByBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMedicine.fulfilled,
        (state, action: PayloadAction<Medicine>) => {
          state.loading = false;
          const index = state.medicines.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (index !== -1) state.medicines[index] = action.payload;
        },
      )
      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMedicine.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          
          state.medicines = state.medicines.filter(
            (m) => m.id !== action.payload,
          );
        },
      )
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete by Bulk
      .addCase(deleteMedicineByBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMedicineByBulk.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          console.log(action.payload, "here");
          
          state.loading = false;
          
          state.medicines = state.medicines.filter(
            (m) => !action.payload.includes(m.id!),
          );
        },
      )
      .addCase(deleteMedicineByBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    )
      // Delete All
      .addCase(deleteAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAllMedicines.fulfilled,
        (state) => {
          state.loading = false;
          
          state.medicines = [];
        },
      )
      .addCase(deleteAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { setSelectedMedicine } = medicineInventorySlice.actions;

export default medicineInventorySlice.reducer;
