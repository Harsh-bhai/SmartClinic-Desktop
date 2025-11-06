import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { updatePrescription } from "../prescriptionSlice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PrescriptionPreview } from "./PrescriptionPreview";

interface PrescriptionFormProps {
  visitId: string;
  existingPrescription: any;
}

export function PrescriptionForm({
  visitId,
  existingPrescription,
}: PrescriptionFormProps) {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("details");
  const [prescriptionData, setPrescriptionData] = useState({
    reason: "",
    examinationFindings: "",
    advice: "",
    nextVisit: "",
  });

  const [medForm, setMedForm] = useState({
    name: "",
    dose: "",
    frequency: [] as string[],
    duration: "",
    remarks: "",
  });

  const [medicines, setMedicines] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 🧠 Load data from Redux
  useEffect(() => {
    if (existingPrescription) {
      setPrescriptionData({
        reason: existingPrescription.reason || "",
        examinationFindings: existingPrescription.examinationFindings || "",
        advice: existingPrescription.advice || "",
        nextVisit: existingPrescription.nextVisit || "",
      });
    }
  }, [existingPrescription]);

  // 💾 Save to backend
  const handleSave = () => {
    dispatch(
      updatePrescription({
        id: visitId,
        data: prescriptionData,
      }),
    );
  };

  // 💊 Medicine CRUD
  const addOrUpdateMedicine = () => {
    if (editingIndex !== null) {
      const updated = [...medicines];
      updated[editingIndex] = medForm;
      setMedicines(updated);
      setEditingIndex(null);
    } else {
      setMedicines([...medicines, medForm]);
    }
    setMedForm({
      name: "",
      dose: "",
      frequency: [],
      duration: "",
      remarks: "",
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Form */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Prescription</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
          </TabsList>

          {/* Prescription Details */}
          <TabsContent value="details">
            <label className="block mt-4 text-left">Reason</label>
            <Textarea
              placeholder="Enter reason for visit"
              value={prescriptionData.reason}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  reason: e.target.value,
                })
              }
            />

            <label className="block mt-4 text-left">Examination Findings</label>
            <Textarea
              placeholder="Enter examination findings"
              value={prescriptionData.examinationFindings}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  examinationFindings: e.target.value,
                })
              }
            />

            <label className="block mt-4 text-left">Advice</label>
            <Textarea
              placeholder="Enter advice"
              value={prescriptionData.advice}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  advice: e.target.value,
                })
              }
            />

            <label className="block mt-4 text-left">Next Visit Date</label>
            <Input
              type="date"
              value={prescriptionData.nextVisit}
              onChange={(e) =>
                setPrescriptionData({
                  ...prescriptionData,
                  nextVisit: e.target.value,
                })
              }
            />

            <Button className="mt-6 w-full" onClick={handleSave}>
              Save Prescription
            </Button>
          </TabsContent>

          {/* Medicines */}
          <TabsContent value="medicines">
            <label className="block mt-2 text-left">Medicine Name</label>
            <Input
              placeholder="Medicine Name"
              value={medForm.name}
              onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
            />

            <label className="block mt-4 text-left">Dose</label>
            <Select
              onValueChange={(val) => setMedForm({ ...medForm, dose: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Dose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Tablet">1 Tablet</SelectItem>
                <SelectItem value="2 Tablets">2 Tablets</SelectItem>
              </SelectContent>
            </Select>

            <label className="block mt-4 text-left">Frequency</label>
            <div className="flex gap-4 mt-2">
              {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                <label key={time} className="flex items-center gap-2">
                  <Checkbox
                    checked={medForm.frequency.includes(time)}
                    onCheckedChange={(checked) => {
                      if (checked)
                        setMedForm({
                          ...medForm,
                          frequency: [...medForm.frequency, time],
                        });
                      else
                        setMedForm({
                          ...medForm,
                          frequency: medForm.frequency.filter(
                            (f) => f !== time,
                          ),
                        });
                    }}
                  />
                  {time}
                </label>
              ))}
            </div>

            <Button className="mt-4" onClick={addOrUpdateMedicine}>
              {editingIndex !== null ? "Update Medicine" : "Add Medicine"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side: Preview Component */}
      <PrescriptionPreview
        visitId={visitId}
        prescriptionData={prescriptionData}
        medicines={medicines}
      />
    </div>
  );
}
