import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Appointment,
  createAppointmentApi,
  getTodayAppointmentsApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  deleteAppointmentsByBulkApi,
} from "./appointmentApi";
import { createPatientApi, getAllPatientsApi, getPatientByIdApi, Patient } from "../patients";

// Frontend-only extended version (adds queue & arrived)
export interface ExtendedAppointment extends Appointment {
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  queueNumber: number;
  arrived: boolean;
}

// wrapper for create patient if new comes, get existing patient from searchbar/dropdown, 

// Slice State
export interface AppointmentState {
  newAppointments: ExtendedAppointment[];
  completedAppointments: ExtendedAppointment[];
  existingPatients: ExtendedAppointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  newAppointments: [],
  completedAppointments: [],
  existingPatients: [],
  loading: false,
  error: null,
};


// Async Thunks


// Fetch today's appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTodayAppointmentsApi();
      // Assign queue numbers and arrived = false
      const patientId = res.patientId;
      const response = await getPatientByIdApi(patientId);
      delete response.createdAt;
      delete response.updatedAt;
      return {...res, ...response} as ExtendedAppointment[];
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to fetch appointments",
      );
    }
  },
);

// Fetch existing Patients
export const fetchExisitingPatients = createAsyncThunk(
  "appointments/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPatientsApi();
      // Assign queue numbers and arrived = false
      return res.map((appt: Patient, i: number) => ({
        patientId: appt.id,
        ...appt,
        paidStatus: false,
        paid: 0,
        treatmentStatus: "pending",
        queueNumber: i + 1,
        arrived: false,
      })) as ExtendedAppointment[];
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to fetch appointments",
      );
    }
  },
);

// Create new appointment (for a patient)
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (data: ExtendedAppointment, { rejectWithValue }) => {
    try {
      const res = await createAppointmentApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to create appointment",
      );
    }
  },
);


// Create appointment for new patient
export const createAppointmentForNewPatient = createAsyncThunk(
  "appointments/createForNewPatient",
  async (data: ExtendedAppointment, { rejectWithValue }) => {
    try {
      // create that patient
      const response = await createPatientApi(data);
      data.patientId = response.id;
      delete response.createdAt;
      delete response.updatedAt;
      let res = await createAppointmentApi(data);
      return {...res, ...response};
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(
          err.message || "Failed to create appointment",
        );
      }
    }
  },
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async (
    { id, data }: { id: string; data: ExtendedAppointment },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateAppointmentApi(id, data);
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to update appointment",
      );
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
      return rejectWithValue(
        err.message || "Failed to delete appointment",
      );
    }
  },
);

// Delete appointment
export const deleteAppointmentByBulk = createAsyncThunk(
  "appointments/deleteBulk",
  async (ids: string[], { rejectWithValue }) => {
    try {
      await deleteAppointmentsByBulkApi(ids);
      return ids;
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to delete appointment",
      );
    }
  },
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Mark patient as arrived
    markArrived: (state, action: PayloadAction<string>) => {
      const appt = state.newAppointments.find((a) => a.id === action.payload);
      if (appt) appt.arrived = true;

      // Re-sort: arrived patients first
      state.newAppointments = [
        ...state.newAppointments.filter((a) => a.arrived),
        ...state.newAppointments.filter((a) => !a.arrived),
      ];
    },

    // Mark appointment as completed
    markCompleted: (state, action: PayloadAction<string>) => {
      const index = state.newAppointments.findIndex(
        (a) => a.id === action.payload,
      );
      if (index !== -1) {
        const [done] = state.newAppointments.splice(index, 1);
        state.completedAppointments.push({
          ...done,
          treatmentStatus: "complete",
        });
      }
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
        state.newAppointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch exisitng patients
      .addCase(fetchExisitingPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExisitingPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.existingPatients = action.payload;
      })
      .addCase(fetchExisitingPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createAppointment.fulfilled, (state, action) => {
        const newAppt: ExtendedAppointment = {
          ...action.payload,
          queueNumber: state.newAppointments.length + 1,
          arrived: false,
        };
        state.newAppointments.push(newAppt);
      })
      // Create for new patient
      .addCase(createAppointmentForNewPatient.fulfilled, (state, action) => {
        const newAppt: ExtendedAppointment = {
          ...action.payload,
          queueNumber: state.newAppointments.length + 1,
          arrived: false,
        };
        state.newAppointments.push(newAppt);
      })

      .addCase(createAppointmentForNewPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(
        updateAppointment.fulfilled,
        (state, action: PayloadAction<ExtendedAppointment>) => {
          const index = state.newAppointments.findIndex(
            (a) => a.id === action.payload.id,
          );
          if (index !== -1) state.newAppointments[index] = action.payload;
        },
      )

      // Delete
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.newAppointments = state.newAppointments.filter(
          (a) => a.id !== action.payload,
        );
      })

      // Delete By bulk
      .addCase(
        deleteAppointmentByBulk.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.newAppointments = state.newAppointments.filter(
            (m) => !action.payload.includes(m.id!),
          );
        },
      );
  },
});

export const { markArrived, markCompleted } = appointmentSlice.actions;

// // Persist Configuration (only appointments data)
// const persistConfig = {
//   key: "appointments",
//   storage,
//   whitelist: ["newAppointments", "completedAppointments"],
// };

// export const appointmentReducer = persistReducer(
//   persistConfig,
//   appointmentSlice.reducer,
// );

export const appointmentReducer = appointmentSlice.reducer;




