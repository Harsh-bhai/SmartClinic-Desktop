"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PlusCircleIcon, Search } from "lucide-react";
import {
  AppointmentTable,
  AppointmentDialog,
} from "@/features/appointments";
import {
  ExtendedAppointment,
  fetchAppointments,
  fetchExistingPatients,
  setSelectedAppointment,
} from "@/features/appointments/appointmentSlice";

const AppointmentPage = () => {
  const dispatch = useAppDispatch();

  const {
    newAppointments,
    completedAppointments,
    existingPatients,
    loading,
    error,
    selectedAppointment
  } = useAppSelector((state) => state.appointments);

  const [searchAppointment, setSearchAppointment] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // ───────────────────────────────────────────────────────────────
  // 🔁 Fetch Data on Mount
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchExistingPatients());
  }, [dispatch]);

  // ───────────────────────────────────────────────────────────────
  // 🔍 Filter Logic
  // ───────────────────────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    if (!searchAppointment.trim()) return { new: newAppointments, completed: completedAppointments };

    const query = searchAppointment.toLowerCase();
    return {
      new: newAppointments.filter(
        (a) =>
          a?.name?.toLowerCase().includes(query) ||
          a?.phone?.toLowerCase().includes(query),
      ),
      completed: completedAppointments.filter(
        (a) =>
          a?.name?.toLowerCase().includes(query) ||
          a?.phone?.toLowerCase().includes(query),
      ),
    };
  }, [searchAppointment, newAppointments, completedAppointments]);

  const filteredPatients = useMemo(() => {
    if (!searchPatient.trim()) return [];
    const query = searchPatient.toLowerCase();
    return existingPatients.filter((p) =>
      p.name.toLowerCase().includes(query),
    );
  }, [searchPatient, existingPatients]);

  // ───────────────────────────────────────────────────────────────
  // 🖼️ UI
  // ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircleIcon size={16} className="mr-1" /> Add Appointment
        </Button>
      </div>

      {/* Search Bars */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Appointment Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchAppointment}
            onChange={(e) => setSearchAppointment(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Patient Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search existing patients..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="pl-8"
          />

          {/* Patient Suggestions */}
          {searchPatient && filteredPatients.length > 0 && (
            <Card className="absolute top-10 w-full shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => {
                    setSearchPatient(patient.name);
                    dispatch(setSelectedAppointment(patient as ExtendedAppointment));
                    setDialogOpen(true);
                  }}
                >
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.gender}, {patient.age} yrs
                  </p>
                </div>
              ))}
            </Card>
          )}

          {/* No Patient Found */}
          {searchPatient && filteredPatients.length === 0 && (
            <Card className="absolute top-10 w-full shadow-lg z-10 p-2 text-center text-sm text-gray-500">
              No patient found for “{searchPatient}”
            </Card>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Appointments</TabsTrigger>
          <TabsTrigger value="completed">Completed Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <AppointmentTable
            newAppointments={filteredAppointments.new}
            loading={loading}
            setDialogOpen={setDialogOpen}
          />
        </TabsContent>

        <TabsContent value="completed">
          <AppointmentTable
            completedAppointments={filteredAppointments.completed}
            loading={loading}
            setDialogOpen={setDialogOpen}
          />
        </TabsContent>
      </Tabs>

      {/* Add Appointment Dialog */}
      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedPatient={selectedAppointment}
      />

      {/* Loading/Error Messages */}
      {loading && (
        <p className="text-center text-sm text-muted-foreground">
          Loading appointments...
        </p>
      )}
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AppointmentPage;
