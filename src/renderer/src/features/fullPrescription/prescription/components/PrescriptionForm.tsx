import React, { useState } from "react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PrescriptionFormProps {
  visitId: string;
}

export function PrescriptionForm({ visitId }: PrescriptionFormProps) {
  const [activeTab, setActiveTab] = useState("patient");
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    medicalHistory: "",
    lifestyle: "",
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
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const toBullets = (text: string) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

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

  const editMedicine = (index: number) => {
    setMedForm(medicines[index]);
    setEditingIndex(index);
  };

  const deleteMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text("Dr. Smile Dental Clinic", 14, 20);
    doc.text("123 Main Street, City", 14, 28);
    doc.text("Phone: +91 9876543210 | Timing: 10am - 7pm", 14, 36);

    doc.text("Patient Details:", 14, 50);
    doc.text(`Name: ${patient.name}`, 14, 58);
    doc.text(`Age: ${patient.age}`, 14, 66);

    if (patient.medicalHistory.trim()) {
      doc.text("Medical History:", 14, 74);
      let y = 82;
      toBullets(patient.medicalHistory).forEach((line) => {
        doc.text(`• ${line}`, 20, y);
        y += 8;
      });
    }

    if (medicines.length > 0) {
      autoTable(doc, {
        startY: 120,
        head: [["Medicine", "Dose", "Frequency", "Duration", "Remarks"]],
        body: medicines.map((m) => [
          m.name,
          m.dose,
          m.frequency.join(", "),
          m.duration,
          m.remarks,
        ]),
        theme: "grid",
      });
    }

    doc.save(`prescription_${visitId}.pdf`);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Form */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <label className="block mt-2 font-medium text-left p-2">Name</label>
            <Input
              placeholder="Enter patient name"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />

            <label className="block mt-4 font-medium text-left p-2">Age</label>
            <Input
              placeholder="Enter age"
              value={patient.age}
              onChange={(e) => setPatient({ ...patient, age: e.target.value })}
            />

            <label className="block mt-4 font-medium text-left p-2">
              Medical History
            </label>
            <Textarea
              placeholder="Enter medical history"
              value={patient.medicalHistory}
              onChange={(e) =>
                setPatient({ ...patient, medicalHistory: e.target.value })
              }
            />
          </TabsContent>

          <TabsContent value="medicines">
            <label className="block mt-2 font-medium text-left p-2">
              Medicine Name
            </label>
            <Input
              placeholder="Medicine Name"
              value={medForm.name}
              onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
            />

            <label className="block mt-4 font-medium text-left p-2">Dose</label>
            <Select
              onValueChange={(val) => setMedForm({ ...medForm, dose: val })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select Dose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Tablet">1 Tablet</SelectItem>
                <SelectItem value="2 Tablets">2 Tablets</SelectItem>
              </SelectContent>
            </Select>

            <label className="block mt-4 font-medium text-left p-2">
              Frequency
            </label>
            <div className="flex justify-around mt-2">
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
                            (f) => f !== time
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

      {/* Right Side: PDF Preview */}
      <div className="w-1/2 bg-gray-50 flex flex-col items-center p-4">
        <div className="flex gap-2 mb-2">
          <Button onClick={() => setZoom((z) => z + 0.1)}>Zoom In</Button>
          <Button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
            Zoom Out
          </Button>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>

        <div
          className="bg-white border rounded w-[210mm] h-[297mm] overflow-auto scale-[var(--zoom)]"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <div className="p-6 text-sm">
            <h2 className="text-lg font-semibold mb-2">Prescription Preview</h2>
            <p>Visit ID: {visitId}</p>
            <hr className="my-2" />
            <h3>Patient: {patient.name}</h3>
            <p>Age: {patient.age}</p>
            <ul className="list-disc ml-4 mt-2">
              {toBullets(patient.medicalHistory).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
