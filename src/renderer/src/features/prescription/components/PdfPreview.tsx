// react/features/patients/components/PdfPreview.tsx
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { type Patient, type Medicine } from "@shared/schemas/patient.schema";

interface PdfPreviewProps {
  patient: Patient;
  medicines: Medicine[];
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ patient, medicines }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Generate PDF blob and set iframe src
  const generatePdfBlob = () => {
    const doc = new jsPDF("p", "pt", "a4");

    // Dentist Info
    doc.setFontSize(14);
    doc.text("Dr. XYZ Dental Clinic", 40, 40);
    doc.setFontSize(10);
    doc.text("123 Clinic Street, City", 40, 60);
    doc.text("Phone: +91 9876543210", 40, 75);
    doc.text("Timing: 10:00 AM - 6:00 PM", 40, 90);

    doc.setLineWidth(0.5);
    doc.line(40, 100, 550, 100);

    // Patient Info
    doc.setFontSize(12);
    doc.text(`Name: ${patient.name || ""}`, 40, 130);
    doc.text(`Age: ${patient.age || ""}`, 40, 150);
    doc.text(`Medical History: ${patient.medicalHistory || ""}`, 40, 170);
    doc.text(`Lifestyle Habits: ${patient.lifestyle || ""}`, 40, 190);

    // Medicines Table
    if (medicines.length > 0) {
      autoTable(doc, {
        startY: 220,
        head: [["Medicine", "Dose", "Frequency", "Duration", "Remarks"]],
        body: medicines.map((m) => [
          m.name,
          m.dose,
          m.frequency.join(", "),
          m.duration,
          m.remarks,
        ]),
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [52, 152, 219], textColor: 255, halign: "left" },
        bodyStyles: { halign: "left" },
      });
    }

    return doc.output("bloburl");
  };

  // Update iframe preview on patient/medicines change
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = generatePdfBlob();
    }
  }, [patient, medicines]);

  // Zoom
  const zoomIn = () => setScale((s) => s + 0.2);
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));

  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        <button
          onClick={zoomOut}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          -
        </button>
        <button
          onClick={zoomIn}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          +
        </button>
      </div>

      {/* PDF Preview (iframe) */}
      <div
        className="w-full h-full cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <iframe
          ref={iframeRef}
          title="PDF Preview"
          className="w-full h-full border"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default PdfPreview;
