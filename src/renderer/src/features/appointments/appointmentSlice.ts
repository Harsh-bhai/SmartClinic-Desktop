import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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


export interface AppointmentMeta {
  appointmentId: string;
  arrived: boolean;
  queueNumber: number;
}


// Extended appointment interface for frontend
export interface ExtendedAppointment extends Appointment {
  queueNumber: number;
  arrived: boolean;
}

// Slice state
export interface AppointmentState {
  newAppointments: ExtendedAppointment[];
  completedAppointments: ExtendedAppointment[];
  existingPatients: Patient[];
  selectedAppointment: ExtendedAppointment | null;
  loading: boolean;
  error: string | null;
  meta: AppointmentMeta[];
}

const initialState: AppointmentState = {
  newAppointments: [],
  completedAppointments: [],
  existingPatients: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  meta: [],
};

// 🔹 Fetch today's appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTodayAppointmentsApi();
      // Add queue numbers and arrived = false
      return res.map((appt: Appointment, i: number) => ({
        ...appt,
        queueNumber: i + 1,
        arrived: false,
      })) as ExtendedAppointment[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch appointments");
    }
  },
);

// 🔹 Fetch existing patients (for dropdown/search)
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

// 🔹 Create new appointment for existing patient
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (data: Appointment, { rejectWithValue }) => {
    try {
      const res = await createAppointmentApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create appointment");
    }
  },
);

// 🔹 Create appointment for a new patient
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

// 🔹 Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async (
    { id, data }: { id: string; data: Appointment },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateAppointmentApi(id, data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update appointment");
    }
  },
);

// 🔹 Delete single appointment
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

// 🔹 Delete multiple appointments
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

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Mark as arrived
    markArrivedToggle: (state, action: PayloadAction<string>) => {
      const appt = state.newAppointments.find((a) => a.id === action.payload);
      if (appt) {
        appt.arrived ? (appt.arrived = false) : (appt.arrived = true);
      }

      // Reorder arrived first
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

    setSelectedAppointment: (state, action: PayloadAction<ExtendedAppointment>) => {
      state.selectedAppointment = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch today's appointments
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

      // Fetch existing patients
      .addCase(fetchExistingPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExistingPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.existingPatients = action.payload;
      })
      .addCase(fetchExistingPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create appointment
      .addCase(createAppointment.fulfilled, (state, action) => {
        const newAppt: ExtendedAppointment = {
          ...action.payload,
          queueNumber: state.newAppointments.length + 1,
          arrived: false,
        };
        state.newAppointments.push(newAppt);
      })

      // Create appointment for new patient
      .addCase(createAppointmentForNewPatient.fulfilled, (state, action) => {
        const newAppt: ExtendedAppointment = {
          ...action.payload,
          queueNumber: state.newAppointments.length + 1,
          arrived: false,
        };
        state.newAppointments.push(newAppt);
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

      // Bulk delete
      .addCase(
        deleteAppointmentsByBulk.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.newAppointments = state.newAppointments.filter(
            (a) => !action.payload.includes(a.id!),
          );
        },
      );
  },
});

export const { markArrivedToggle, markCompleted, setSelectedAppointment } =
  appointmentSlice.actions;
export const appointmentReducer = appointmentSlice.reducer;
