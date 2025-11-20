export function PatientInfo({ selectedAppointment }) {
  return (
    <table className="w-full mt-4 text-left border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      <tbody>
        <tr className="border-b">
          <td className="p-2 font-semibold">Name</td>
          <td className="p-2">{selectedAppointment?.name}</td>
        </tr>

        <tr className="border-b">
          <td className="p-2 font-semibold">Age</td>
          <td className="p-2">{selectedAppointment?.age}</td>
          <td className="p-2 font-semibold">Gender</td>
          <td className="p-2">{selectedAppointment?.gender}</td>
        </tr>

        <tr>
          <td className="p-2 font-semibold">PID</td>
          <td className="p-2">{selectedAppointment?.patientId}</td>
          <td className="p-2 font-semibold">AID</td>
          <td className="p-2">{selectedAppointment?.id}</td>
        </tr>
      </tbody>
    </table>
  );
}
