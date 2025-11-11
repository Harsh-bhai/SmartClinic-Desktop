import { Input } from "@renderer/components/ui/input";
import React from "react";

const Vitals = ({ setPrescriptionData }) => {
  const handleNestedChange = (
    parent: "vitals",
    field: string,
    value: string,
  ) => {
    setPrescriptionData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };
  return (
    <div>
      {" "}
      {/* Vitals */}
      <h3 className="font-semibold text-md mt-6 mb-2 text-left">Vitals</h3>
      <div className="grid grid-cols-2 gap-3">
        {["temperature", "pulseRate", "oxygenSaturation", "bloodPressure"].map(
          (field) => (
            <div key={field}>
              <label className="block capitalize text-left">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <Input
                // value={(prescriptionData.vitals as any)[field] || ""}
                onChange={(e) =>
                  handleNestedChange("vitals", field, e.target.value)
                }
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default Vitals;
