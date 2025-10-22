import { Appointment } from "@/features/appointments/appointmentSlice";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  appointments: Appointment[];
  onArrived?: (id: string) => void;
  onComplete?: (id: string) => void;
  readOnly?: boolean;
  showActions?: boolean;
}

export default function AppointmentTable({
  appointments,
  onArrived,
  onComplete,
  readOnly = false,
  showActions = true,
}: Props) {
  if (!appointments?.length) return <p>No appointments found.</p>;

  // Automatically sort: arrived first, then by queue number
  const sortedAppointments = [
    ...appointments.filter((a) => a.arrived).sort((a, b) => a.queueNumber - b.queueNumber),
    ...appointments.filter((a) => !a.arrived),
  ];

  return (
    <div className="border rounded-md overflow-hidden mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Arrived</TableHead>
            <TableHead>Treatment</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((a, index) => (
            <TableRow key={a.id} className={a.arrived ? "bg-green-50" : ""}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell>{a.age}</TableCell>
              <TableCell>{a.gender}</TableCell>
              <TableCell>{a.paid}</TableCell>
              <TableCell>{a.paidStatus ? "Paid" : "Unpaid"}</TableCell>
              <TableCell>{a.phone || "—"}</TableCell>
              <TableCell>{a.address || "—"}</TableCell>
              <TableCell>
                {readOnly ? (
                  a.arrived ? "✅ Yes" : "❌ No"
                ) : (
                  <Button
                    size="sm"
                    variant={a.arrived ? "secondary" : "outline"}
                    onClick={() => onArrived?.(a.id!)}
                  >
                    {a.arrived ? "Arrived" : "Mark Arrived"}
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {a.treatment === "complete" ? "✅ Complete" : "⏳ Pending"}
              </TableCell>
              {showActions && (
                <TableCell>
                  {!readOnly && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onComplete?.(a.id!)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
