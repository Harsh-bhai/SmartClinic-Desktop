// components/VitalsInput.tsx
import { Input } from "@/components/ui/input";

interface VitalsProps {
  vitals: {
    temperature?: string;
    pulseRate?: string;
    oxygenSaturation?: string;
    bloodPressure?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function Vitals({ vitals, onChange }: VitalsProps) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-md mb-2">Vitals</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-left">Body Temperature (°F)</label>
          <Input
            value={vitals.temperature || ""}
            onChange={(e) => onChange("temperature", e.target.value)}
            placeholder="e.g., 98.6°F"
          />
        </div>

        <div>
          <label className="block text-left">Pulse Rate (per min)</label>
          <Input
            value={vitals.pulseRate || ""}
            onChange={(e) => onChange("pulseRate", e.target.value)}
            placeholder="e.g., 88/min"
          />
        </div>

        <div>
          <label className="block text-left">Oxygen Saturation (%)</label>
          <Input
            value={vitals.oxygenSaturation || ""}
            onChange={(e) => onChange("oxygenSaturation", e.target.value)}
            placeholder="e.g., 96%"
          />
        </div>

        <div>
          <label className="block text-left">Blood Pressure (mmHg)</label>
          <Input
            value={vitals.bloodPressure || ""}
            onChange={(e) => onChange("bloodPressure", e.target.value)}
            placeholder="e.g., 130/90 mmHg"
          />
        </div>
      </div>
    </div>
  );
}
