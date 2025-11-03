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
  completedAt?: string;
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

export const completeAppointment = createAsyncThunk(
  "appointments/complete",
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { appointments: AppointmentState };
    const appt = state.appointments.newAppointments.find((a) => a.id === id);
    if (!appt) return rejectWithValue("Appointment not found");

    const updated = { ...appt, treatmentStatus: "complete" };
    try {
      await updateAppointmentApi(updated);
      dispatch(markCompleted(id)); // update locally
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to complete");
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
      const appt = state.newAppointments.find((a) => a.id === id);
      if (!appt) return;

      const newVal = !appt.arrived;
      appt.arrived = newVal;
      state.meta[id] = {
        ...(state.meta[id] || { id, queueNumber: appt.queueNumber }),
        arrived: newVal,
      };

      // sort visually (arrived first)
      state.newAppointments.sort((a, b) => {
        if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
        return a.arrived ? -1 : 1;
      });
    },

    markCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.newAppointments.findIndex((a) => a.id === id);
      if (index === -1) return;

      const [done] = state.newAppointments.splice(index, 1);
      const meta = state.meta[id] || {
        id,
        arrived: false,
        queueNumber: done.queueNumber,
      };
      state.meta[id] = { ...meta, completedAt: new Date().toISOString() };

      state.completedAppointments.push({
        ...done,
        treatmentStatus: "complete",
      });
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

        // build both arrays from DB + meta
        const newList: ExtendedAppointment[] = [];
        const completedList: ExtendedAppointment[] = [];

        for (const appt of fetched) {
          const meta = state.meta[appt.id!] || {
            id: appt.id!,
            arrived: false,
            queueNumber: newList.length + 1,
          };

          const extended = { ...appt, ...meta };

          if (appt.treatmentStatus === "complete") completedList.push(extended);
          else newList.push(extended);
        }

        // sort & assign
        state.newAppointments = newList.sort((a, b) => {
          if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
          return a.arrived ? -1 : 1;
        });

        state.completedAppointments = completedList.sort(
          (a, b) =>
            new Date(a.updatedAt!).getTime() - new Date(b.updatedAt!).getTime(),
        );
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
  // whitelist: ["meta", "newAppointments", "completedAppointments"],
  whitelist: ["meta"],
};

export const appointmentReducer = persistReducer(
  persistConfig,
  appointmentSlice.reducer,
);
