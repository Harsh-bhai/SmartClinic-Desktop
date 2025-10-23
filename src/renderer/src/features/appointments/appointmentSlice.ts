import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllPatientsApi, Patient } from "@/features/patients/patientApi";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Appointment Interface
export interface Appointment extends Patient {
  queueNumber: number;
  arrived: boolean;
}

// State
export interface AppointmentState {
  newAppointments: Appointment[];
  completedAppointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  newAppointments: [],
  completedAppointments: [],
  loading: false,
  error: null,
};

// Async thunk example
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async () => {
    const patients = await getAllPatientsApi();
    return patients.map((p: Patient, i: number) => ({
      ...p,
      queueNumber: i + 1,
      arrived: false,
    }));
  }
);

// Slice
const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    markArrived: (state, action: PayloadAction<string>) => {
      const target = state.newAppointments.find(a => a.id === action.payload);
      if (target) target.arrived = true;

      state.newAppointments = [
        ...state.newAppointments
          .filter(a => a.arrived)
          .sort((a, b) => a.queueNumber - b.queueNumber),
        ...state.newAppointments.filter(a => !a.arrived),
      ];
    },
    markCompleted: (state, action: PayloadAction<string>) => {
      const index = state.newAppointments.findIndex(a => a.id === action.payload);
      if (index !== -1) {
        const [done] = state.newAppointments.splice(index, 1);
        done.treatment = "complete";
        state.completedAppointments.push(done);
      }
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
    state.newAppointments.push(action.payload);
  },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAppointments.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.newAppointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      });
  },
});

export const { markArrived, markCompleted, addAppointment } = appointmentSlice.actions;

// 👇 Only persist selected keys
const persistConfig = {
  key: "appointments",
  storage,
  whitelist: ["newAppointments", "completedAppointments"],
};

export const appointmentReducer = persistReducer(persistConfig, appointmentSlice.reducer);
