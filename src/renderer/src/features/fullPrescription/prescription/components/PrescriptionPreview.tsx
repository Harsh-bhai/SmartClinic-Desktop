import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PrescriptionPreviewProps {
  visitId: string;
  prescriptionData: {
    reason: string;
    examinationFindings: string;
    advice: string;
    nextVisit: string;
  };
  medicines: {
    name: string;
    dose: string;
    frequency: string[];
    duration: string;
    remarks: string;
  }[];
}

export function PrescriptionPreview({
  visitId,
  prescriptionData,
  medicines,
}: PrescriptionPreviewProps) {
  const [zoom, setZoom] = useState(1);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("Dr. Smile Dental Clinic", 14, 20);
    doc.text(`Visit ID: ${visitId}`, 14, 28);
    doc.text("Prescription Details:", 14, 40);
    doc.text(`Reason: ${prescriptionData.reason}`, 14, 48);
    doc.text(`Findings: ${prescriptionData.examinationFindings}`, 14, 56);
    doc.text(`Advice: ${prescriptionData.advice}`, 14, 64);

    if (medicines.length > 0) {
      autoTable(doc, {
        startY: 80,
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
    <div className="w-1/2 bg-gray-50 flex flex-col items-center p-4">
      <div className="flex gap-2 mb-3">
        <Button onClick={() => setZoom((z) => z + 0.1)}>Zoom In</Button>
        <Button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
          Zoom Out
        </Button>
        <Button onClick={generatePDF}>Generate PDF</Button>
      </div>

      <div
        className="bg-white border rounded w-[210mm] h-[297mm] overflow-auto p-6"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <h2 className="text-lg font-semibold mb-2">
          Prescription Preview (Visit ID: {visitId})
        </h2>
        <hr className="my-2" />
        <p>
          <strong>Reason:</strong> {prescriptionData.reason}
        </p>
        <p>
          <strong>Findings:</strong> {prescriptionData.examinationFindings}
        </p>
        <p>
          <strong>Advice:</strong> {prescriptionData.advice}
        </p>
        <p>
          <strong>Next Visit:</strong> {prescriptionData.nextVisit}
        </p>

        {medicines.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold">Medicines</h3>
            <ul className="list-disc ml-5">
              {medicines.map((m, i) => (
                <li key={i}>
                  {m.name} - {m.dose} ({m.frequency.join(", ")}) for{" "}
                  {m.duration} days
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
