"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  AppointmentTable,
  AddAppointmentDialog,
} from "@/features/appointments";
import { useAppSelector } from "@/app/hooks";
import { PlusCircleIcon, Search } from "lucide-react";

const AppointmentPage = () => {
  const { newAppointments, completedAppointments } = useAppSelector(
    (state) => state.appointments,
  );

  const [searchAppointment, setSearchAppointment] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter logic
  const filteredAppointments = {
    new: newAppointments.filter((a) =>
      a.name.toLowerCase().includes(searchAppointment.toLowerCase()),
    ),
    completed: completedAppointments.filter((a) =>
      a.name.toLowerCase().includes(searchAppointment.toLowerCase()),
    ),
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircleIcon size={16} /> Add Appointment
        </Button>
      </div>

      {/* Search bars */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Appointment search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchAppointment}
            onChange={(e) => setSearchAppointment(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Patient search (suggestion-style dropdown later) */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search existing patients..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="pl-8"
          />
          {/* TODO: Replace this block with dynamic dropdown search results */}
          {searchPatient && (
            <Card className="absolute top-10 w-full shadow-lg z-10 p-2">
              <p className="text-sm text-gray-500">
                Search results for "{searchPatient}"
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Appointments</TabsTrigger>
          <TabsTrigger value="completed">Completed Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <AppointmentTable
            newAppointments={filteredAppointments.new}
            completedAppointments={[]}
          />
        </TabsContent>

        <TabsContent value="completed">
          <AppointmentTable
            newAppointments={[]}
            completedAppointments={filteredAppointments.completed}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <AddAppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default AppointmentPage;
