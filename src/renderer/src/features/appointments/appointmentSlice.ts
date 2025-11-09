import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {getLocalDateString} from "./utils/date"
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
  lastQueueResetDate?: string;
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
  lastQueueResetDate: undefined,
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
    data.id = randomAlphaNumId();
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
    data.id = randomAlphaNumId();
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
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as { appointments: AppointmentState };
    const appt = state.appointments.newAppointments.find((a) => a.id === id);
    if (!appt) return rejectWithValue("Appointment not found");

    const updated = { ...appt, treatmentStatus: "complete" };
    try {
      const res = await updateAppointmentApi(updated);
      return res; // return the updated appointment object
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
        arrived: done.arrived,
        queueNumber: done.queueNumber,
      };
      state.meta[id] = {
        ...meta,
        completedAt: new Date().toISOString(),
      };

      const completedAppointment: ExtendedAppointment = {
        ...done,
        treatmentStatus: "complete",
        queueNumber: meta.queueNumber,
        arrived: meta.arrived,
      };

      state.completedAppointments.push(completedAppointment);
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

  const today = getLocalDateString();

  // ✅ Reset meta + queue numbers when day changes
  if (state.lastQueueResetDate !== today) {
    state.meta = {};
    state.newAppointments = [];
    state.completedAppointments = [];
    state.lastQueueResetDate = today;
  }

  const newList: ExtendedAppointment[] = [];
  const completedList: ExtendedAppointment[] = [];

  // Compute global max queue once from state.meta
  const existingQueues = Object.values(state.meta).map(m => m.queueNumber);
  let currentMaxQueue = existingQueues.length > 0 ? Math.max(...existingQueues) : 0;

  for (const appt of fetched) {
    let meta = state.meta[appt.id!];

    if (!meta) {
      currentMaxQueue += 1;
      meta = { id: appt.id!, arrived: false, queueNumber: currentMaxQueue };
      state.meta[appt.id!] = meta;
    }

    const extended = { ...appt, ...meta };
    if (appt.treatmentStatus === "complete") completedList.push(extended);
    else newList.push(extended);
  }

  state.newAppointments = newList.sort((a, b) => {
    if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
    return a.arrived ? -1 : 1;
  });

  state.completedAppointments = completedList.sort((a, b) => {
    const at = state.meta[a.id!]?.completedAt
      ? new Date(state.meta[a.id!].completedAt!).getTime()
      : 0;
    const bt = state.meta[b.id!]?.completedAt
      ? new Date(state.meta[b.id!].completedAt!).getTime()
      : 0;
    return at - bt;
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
      .addCase(completeAppointment.fulfilled, (state, action) => {
        const appt = action.payload as ExtendedAppointment;
        const id = appt.id!;
        const index = state.newAppointments.findIndex((a) => a.id === id);
        if (index === -1) return;

        const [done] = state.newAppointments.splice(index, 1);
        const meta = state.meta[id] || {
          id,
          arrived: done.arrived,
          queueNumber: done.queueNumber,
        };
        state.meta[id] = { ...meta, completedAt: new Date().toISOString() };

        state.completedAppointments.push({
          ...appt,
          queueNumber: meta.queueNumber,
          arrived: meta.arrived,
          treatmentStatus: "complete",
        });
      })

      // Create for new patient
      .addCase(createAppointmentForNewPatient.fulfilled, (state, action) => {
        const appt = action.payload;

        const existingQueues = Object.values(state.meta).map(
          (m) => m.queueNumber,
        );
        const maxQueue =
          existingQueues.length > 0 ? Math.max(...existingQueues) : 0;

        const metaInfo: AppointmentMeta = {
          id: appt.id ?? randomAlphaNumId(),
          arrived: false,
          queueNumber: maxQueue + 1,
        };

        state.meta[appt.id!] = metaInfo;

        const extended = {
          ...appt,
          ...metaInfo,
          treatmentStatus: appt.treatmentStatus ?? "pending",
        };
        state.newAppointments.push(extended);
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
      // Create appointment (existing patient)
      .addCase(createAppointment.fulfilled, (state, action) => {
        const appt = action.payload;

        // Find current max queue number from meta
        const existingQueues = Object.values(state.meta).map(
          (m) => m.queueNumber,
        );
        const maxQueue =
          existingQueues.length > 0 ? Math.max(...existingQueues) : 0;

        const metaInfo: AppointmentMeta = {
          id: appt.id ?? randomAlphaNumId(),
          arrived: false,
          queueNumber: maxQueue + 1,
        };

        // Store meta
        state.meta[appt.id!] = metaInfo;

        // Extend appointment and add to list immediately
        const extended: ExtendedAppointment = {
          ...appt,
          ...metaInfo,
          treatmentStatus: appt.treatmentStatus ?? "pending",
        };

        state.newAppointments.push(extended);

        // Optional: sort arrived ones first
        state.newAppointments.sort((a, b) => {
          if (a.arrived === b.arrived) return a.queueNumber - b.queueNumber;
          return a.arrived ? -1 : 1;
        });
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
  whitelist: ["meta", "lastQueueResetDate"],
};

export const appointmentReducer = persistReducer(
  persistConfig,
  appointmentSlice.reducer,
);
