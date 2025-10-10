import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updatePatient } from "@/features/prescription";

export default function PatientForm() {
  const patient = useAppSelector((s) => s.prescription.patient);
  const dispatch = useAppDispatch();

  return (
    <div>
      <label className="block mt-2">Name</label>
      <Input
        value={patient.name}
        onChange={(e) => dispatch(updatePatient({ name: e.target.value }))}
      />

      <label className="block mt-4">Age</label>
      <Input
        value={patient.age}
        onChange={(e) => dispatch(updatePatient({ age: e.target.value }))}
      />

      <label className="block mt-4">Medical History</label>
      <Textarea
        value={patient.medicalHistory}
        onChange={(e) =>
          dispatch(updatePatient({ medicalHistory: e.target.value }))
        }
      />

      <label className="block mt-4">Lifestyle Habits</label>
      <Textarea
        value={patient.lifestyle}
        onChange={(e) => dispatch(updatePatient({ lifestyle: e.target.value }))}
      />
    </div>
  );
}
