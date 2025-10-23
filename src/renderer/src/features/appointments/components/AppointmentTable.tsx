import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "../appointmentSlice";

// ✅ Define prop types here
interface AppointmentTableProps {
  newAppointments: Appointment[];
  completedAppointments: Appointment[];
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  newAppointments,
  completedAppointments,
}) => {
  return (
    <div className="space-y-6">
      {/* New Appointments */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">New Appointments</h2>
        {newAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">No new appointments</p>
        ) : (
          <div className="space-y-2">
            {newAppointments.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center border rounded-md p-2 hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.createdAt}</p>
                </div>
                <Badge>New</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Completed Appointments */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Completed Appointments</h2>
        {completedAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">No completed appointments</p>
        ) : (
          <div className="space-y-2">
            {completedAppointments.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center border rounded-md p-2 hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.createdAt}</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

