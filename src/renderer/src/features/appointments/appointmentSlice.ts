import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { getLocalDateString } from "./utils/date";

import {
  Appointment,
  createAppointmentApi,
  getTodayAppointmentsApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  deleteAppointmentsByBulkApi,
} from "./appointmentApi";

import { createPatientApi, getAllPatientsApi, Patient } from "../patients";
import { randomAlphaNumId } from "@renderer/lib/id";

/* -------------------------------------------------------------------------- */
/*                                  STATE TYPES                               */
/* -------------------------------------------------------------------------- */

export interface AppointmentState {
  newAppointments: Appointment[];
  completedAppointments: Appointment[];
  existingPatients: Patient[];
  selectedAppointment: Appointment | null;

  loading: boolean;
  error: string | null;

  lastQueueResetDate?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 INITIAL STATE                              */
/* -------------------------------------------------------------------------- */

const initialState: AppointmentState = {
  newAppointments: [],
  completedAppointments: [],
  existingPatients: [],
  selectedAppointment: null,

  loading: false,
  error: null,

  lastQueueResetDate: undefined,
};

function rebuildQueueNumbers(list: Appointment[]) {
  return list.map((a, index) => ({
    ...a,
    queueNumber: index + 1,
  }));
}

/* -------------------------------------------------------------------------- */
/*                                ASYNC THUNKS                                */
/* -------------------------------------------------------------------------- */

// Fetch today's appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTodayAppointmentsApi();
      return res as Appointment[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Fetch all patients
export const fetchExistingPatients = createAsyncThunk(
  "appointments/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPatientsApi();
      return res as Patient[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Create appointment (existing patient)
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (data: Appointment, { rejectWithValue }) => {
    data.id = randomAlphaNumId();
    try {
      return await createAppointmentApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Create appointment for new patient
export const createAppointmentForNewPatient = createAsyncThunk(
  "appointments/createForNewPatient",
  async (data: Appointment, { rejectWithValue }) => {
    try {
      const patientData: Patient = {
        name: data.name!,
        age: data.age!,
        gender: data.gender!,
        phone: data.phone!,
        address: data.address!,
      };

      const newPatient = await createPatientApi(patientData);

      const apptData: Appointment = {
        ...data,
        id: randomAlphaNumId(),
        patientId: newPatient.id,
      };

      return await createAppointmentApi(apptData);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async (data: Appointment, { rejectWithValue }) => {
    try {
      return await updateAppointmentApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Mark appointment complete
export const completeAppointment = createAsyncThunk(
  "appointments/complete",
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as { appointments: AppointmentState };

    const appt = state.appointments.newAppointments.find((a) => a.id === id);
    if (!appt) return rejectWithValue("Appointment not found");

    const updated = { ...appt, treatmentStatus: "complete" };

    try {
      return await updateAppointmentApi(updated);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAppointmentApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      return rejectWithValue(err.message);
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                                    SLICE                                   */
/* -------------------------------------------------------------------------- */

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    /* -------------------------- LOCAL ONLY: toggle arrived ------------------------- */
    markArrivedToggle: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const appt = state.newAppointments.find((a) => a.id === id);
      if (!appt) return;

      appt.arrived = !appt.arrived;

      // Re-sort: arrived first, then queueNumber
      state.newAppointments.sort((a, b) => {
        if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
        return a.arrived ? -1 : 1;
      });
    },

    setSelectedAppointment: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.selectedAppointment = action.payload;
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                               EXTRA REDUCERS                               */
  /* -------------------------------------------------------------------------- */

  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;

        const today = getLocalDateString();

        // Reset queue at new day
        if (state.lastQueueResetDate !== today) {
          state.lastQueueResetDate = today;
        }

        const fetched = action.payload;

        const sorted = fetched.sort((a, b) => {
          if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
          return a.arrived ? -1 : 1;
        });

        state.newAppointments = rebuildQueueNumbers(sorted);

        state.completedAppointments = fetched
          .filter((a) => a.treatmentStatus === "complete")
          .sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""));
      })

      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExistingPatients.fulfilled, (state, action) => {
        state.existingPatients = action.payload;
      })

      // Create appointment
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.newAppointments.push(action.payload);
        state.newAppointments = rebuildQueueNumbers(state.newAppointments);
      })

      // Create appointment (new patient)
      .addCase(createAppointmentForNewPatient.fulfilled, (state, action) => {
        state.newAppointments.push(action.payload);
        state.newAppointments = rebuildQueueNumbers(state.newAppointments);
      })

      // Update appointment
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.newAppointments.findIndex((a) => a.id === updated.id);

        if (idx !== -1) {
          state.newAppointments[idx] = updated;

          // Resort after update
          state.newAppointments.sort((a, b) => {
            if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
            return a.arrived ? -1 : 1;
          });
        }
      })

      // Complete appointment
      .addCase(completeAppointment.fulfilled, (state, action) => {
        const updated = action.payload;
        const id = updated.id;

        const index = state.newAppointments.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.newAppointments.splice(index, 1);
          state.newAppointments = rebuildQueueNumbers(state.newAppointments);

          state.completedAppointments.push(updated);
        }
      })

      // Delete
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.newAppointments = rebuildQueueNumbers(
          state.newAppointments.filter((a) => a.id !== action.payload),
        );

        state.completedAppointments = state.completedAppointments.filter(
          (a) => a.id !== action.payload,
        );
      })

      // Bulk delete
      .addCase(deleteAppointmentsByBulk.fulfilled, (state, action) => {
        state.newAppointments = state.newAppointments.filter(
          (a) => !action.payload.includes(a.id!),
        );
        state.completedAppointments = state.completedAppointments.filter(
          (a) => !action.payload.includes(a.id!),
        );
      });
  },
});

/* -------------------------------------------------------------------------- */
/*                                     EXPORTS                                */
/* -------------------------------------------------------------------------- */

export const { markArrivedToggle, setSelectedAppointment } =
  appointmentSlice.actions;

/* ------------------------ Persist selectedAppointment only ----------------------- */

const persistConfig = {
  key: "appointments",
  storage,
  whitelist: ["selectedAppointment", "lastQueueResetDate"],
};

export const appointmentReducer = persistReducer(
  persistConfig,
  appointmentSlice.reducer,
);
