import React, { useState, useRef, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { PrescriptionPDFDocument } from "./PrescriptionPDFDocument";
import { useTheme } from "@/components/provider/ThemeProvider"; // ✅ from your ShadCN provider

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
  const [zoom, setZoom] = useState(0.9);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // 🖱 Zoom with Ctrl + Scroll
  useEffect(() => {
    console.log("prescriptiondata", prescriptionData);
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prev) => {
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          return Math.min(Math.max(prev + delta, 0.4), 1.8);
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      className={`w-1/2 flex flex-col items-center p-4 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-neutral-900" : "bg-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between w-full mb-3 items-center">
        <h2
          className={`font-semibold text-lg ml-2 ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Live PDF Preview
        </h2>
      </div>

      {/* PDF Viewer */}
      <div
        className={`flex justify-center items-center flex-1 w-full overflow-auto rounded-lg ${
          isDark ? "bg-neutral-800" : "bg-gray-200"
        }`}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
            width: "210mm",
            height: "297mm",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PDFViewer
            style={{
              width: "210mm",
              height: "297mm",
              border: isDark ? "1px solid #444" : "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
              color: isDark ? "#f0f0f0" : "#000000",
            }}
            showToolbar={false}
          >
            <PrescriptionPDFDocument
              visitId={visitId}
              prescriptionData={prescriptionData}
              medicines={medicines}
              isDarkMode={isDark}
            />
          </PDFViewer>
        </div>
      </div>

      <p
        className={`text-xs mt-2 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Hold <kbd>Ctrl</kbd> + scroll to zoom
      </p>
    </div>
  );
}
