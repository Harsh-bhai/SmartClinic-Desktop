import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { v4 as uuidv4 } from "uuid";

import {
  Appointment,
  createAppointmentApi,
  getTodayAppointmentsApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  deleteAppointmentsByBulkApi,
  getAllAppointmentsApi,
} from "./appointmentApi";
import { createPatientApi, getAllPatientsApi, Patient } from "../patients";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface AppointmentMeta {
  id: string; // Local UUID for tracking
  arrived: boolean;
  queueNumber: number;
}

export interface ExtendedAppointment extends Appointment {
  queueNumber: number;
  arrived: boolean;
}

export interface AppointmentState {
  newAppointments: ExtendedAppointment[];
  completedAppointments: ExtendedAppointment[];
  existingPatients: Patient[];
  selectedAppointment: ExtendedAppointment | null;
  loading: boolean;
  error: string | null;
  meta: Record<string, AppointmentMeta>; // Persisted metadata
}

// --------------------------------------------------
// INITIAL STATE
// --------------------------------------------------

const initialState: AppointmentState = {
  newAppointments: [],
  completedAppointments: [],
  existingPatients: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  meta: {},
};

// --------------------------------------------------
// ASYNC THUNKS
// --------------------------------------------------

// Fetch today's appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTodayAppointmentsApi();
      return res as Appointment[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch appointments");
    }
  },
);

// Fetch patients
export const fetchExistingPatients = createAsyncThunk(
  "appointments/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPatientsApi();
      return res as Patient[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch patients");
    }
  },
);

// Create new appointment (existing patient)
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (data: Appointment, { rejectWithValue }) => {
    data.id = uuidv4();
    try {
      const res = await createAppointmentApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create appointment");
    }
  },
);

// Create appointment (new patient)
export const createAppointmentForNewPatient = createAsyncThunk(
  "appointments/createForNewPatient",
  async (data: Appointment, { rejectWithValue }) => {
    data.id = uuidv4();
    try {
      const patientData: Patient = {
        name: data.name!,
        age: data.age!,
        gender: data.gender!,
        phone: data.phone!,
        address: data.address!,
      };
      const newPatient = await createPatientApi(patientData);
      console.log("newpatient", newPatient);
      
      const appointmentData: Appointment = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patientId: newPatient.id,
      };
      const newAppointmentData = await createAppointmentApi(appointmentData);
      return newAppointmentData;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create appointment");
    }
  },
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async (data: ExtendedAppointment, { rejectWithValue }) => {
    try {
      const res = await updateAppointmentApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update appointment");
    }
  },
);

// Delete single appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAppointmentApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete appointment");
    }
  },
);

// Bulk delete
export const deleteAppointmentsByBulk = createAsyncThunk(
  "appointments/deleteBulk",
  async (ids: string[], { rejectWithValue }) => {
    try {
      await deleteAppointmentsByBulkApi(ids);
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete appointments");
    }
  },
);

// --------------------------------------------------
// SLICE
// --------------------------------------------------

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    markArrivedToggle: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      // Update meta
      const meta = state.meta[id];
      if (meta) {
        meta.arrived = !meta.arrived;
      }

      // Update appointment in newAppointments too
      const appt = state.newAppointments.find((a) => a.id === id);
      if (appt) {
        appt.arrived = !appt.arrived;
      }

      // Reorder both newAppointments and meta by arrived status  
      const sortedAppointments = [
        ...state.newAppointments.filter((a) => a.arrived),
        ...state.newAppointments.filter((a) => !a.arrived),
      ];

      sortedAppointments.forEach((appt, i) => {
        appt.queueNumber = i + 1;

        // Sync meta queue order too
        if (state.meta[appt.id!]) {
          state.meta[appt.id!].queueNumber = i + 1;
        }
      });

      state.newAppointments = sortedAppointments;
    },
    markCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.newAppointments.findIndex((a) => a.id === id);
      if (index !== -1) {
        const [done] = state.newAppointments.splice(index, 1);
        state.completedAppointments.push({
          ...done,
          treatmentStatus: "complete",
        });
        delete state.meta[id];
      }
    },

    setSelectedAppointment: (
      state,
      action: PayloadAction<ExtendedAppointment | null>,
    ) => {
      state.selectedAppointment = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;

        const fetched = action.payload;
        const meta = state.meta;

        state.newAppointments = fetched.map((appt, i) => {
          const metaInfo =
            meta[appt.id!] ||
            ({
              id: appt.id!,
              arrived: false,
              queueNumber: i + 1,
            } as AppointmentMeta);

          // Ensure meta is updated
          state.meta[appt.id!] = metaInfo;

          return { ...appt, ...metaInfo };
        });
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch existing patients
      .addCase(fetchExistingPatients.fulfilled, (state, action) => {
        state.existingPatients = action.payload;
      })

      // Create appointment
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<ExtendedAppointment>) => {
          const appt = action.payload;
          appt.id = uuidv4();

          const metaInfo: AppointmentMeta = {
            id: appt.id,
            arrived: false,
            queueNumber: state.newAppointments.length + 1,
          };

          state.meta[appt.id] = metaInfo;
          state.newAppointments.push({ ...appt, ...metaInfo });
        },
      )

      // Create for new patient
      .addCase(createAppointmentForNewPatient.fulfilled, (state, action) => {
        const appt = action.payload;

        const metaInfo: AppointmentMeta = {
          id: appt.id ?? uuidv4(),
          arrived: false,
          queueNumber: state.newAppointments.length + 1,
        };

        state.meta[appt.id] = metaInfo;
        state.newAppointments.push({ ...appt, ...metaInfo });
      })

      // Update
      .addCase(
        updateAppointment.fulfilled,
        (state, action: PayloadAction<ExtendedAppointment>) => {
          const index = state.newAppointments.findIndex(
            (a) => a.id === action.payload.id,
          );
          if (index !== -1)
            state.newAppointments[index] = {
              ...action.payload,
              ...state.meta[action.payload.id!],
            };
        },
      )

      // Delete
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.newAppointments = state.newAppointments.filter(
          (a) => a.id !== action.payload,
        );
        delete state.meta[action.payload];
      })

      // Bulk delete
      .addCase(
        deleteAppointmentsByBulk.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.newAppointments = state.newAppointments.filter(
            (a) => !action.payload.includes(a.id!),
          );
          action.payload.forEach((id) => delete state.meta[id]);
        },
      );
  },
});

export const { markArrivedToggle, markCompleted, setSelectedAppointment } =
  appointmentSlice.actions;

// --------------------------------------------------
// REDUCER WITH PERSIST (only for meta)
// --------------------------------------------------

const persistConfig = {
  key: "appointmentMeta",
  storage,
  whitelist: ["meta"],
};

export const appointmentReducer = persistReducer(
  persistConfig,
  appointmentSlice.reducer,
);
