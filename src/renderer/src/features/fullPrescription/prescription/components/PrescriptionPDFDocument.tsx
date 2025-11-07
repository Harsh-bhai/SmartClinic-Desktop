import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface PrescriptionPDFDocumentProps {
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
  isDarkMode?: boolean;
}

export function PrescriptionPDFDocument({
  visitId,
  prescriptionData,
  medicines,
  isDarkMode = false,
}: PrescriptionPDFDocumentProps) {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Helvetica",
      fontSize: 12,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
      color: isDarkMode ? "#f0f0f0" : "#000000",
    },
    header: {
      textAlign: "center",
      marginBottom: 20,
    },
    section: {
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: "row",
      borderBottom: `1pt solid ${isDarkMode ? "#ccc" : "#000"}`,
      paddingBottom: 4,
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: `0.5pt solid ${isDarkMode ? "#555" : "#aaa"}`,
      paddingVertical: 3,
    },
    cell: {
      flex: 1,
      paddingRight: 4,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Dr. Smile Dental Clinic
          </Text>
          <Text>123 Main Street, Raipur</Text>
          <Text>Phone: +91 9876543210</Text>
          <Text>Visit ID: {visitId}</Text>
        </View>

        {/* Prescription Info */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 6, fontWeight: "bold" }}>
            Prescription Details
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Reason: </Text>
            {prescriptionData.reason || "—"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Findings: </Text>
            {prescriptionData.examinationFindings || "—"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Advice: </Text>
            {prescriptionData.advice || "—"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Next Visit: </Text>
            {prescriptionData.nextVisit || "—"}
          </Text>
        </View>

        {/* Medicines */}
        {medicines.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>
              Medicines
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, { flex: 1.5 }]}>Medicine</Text>
              <Text style={styles.cell}>Dose</Text>
              <Text style={styles.cell}>Frequency</Text>
              <Text style={styles.cell}>Duration</Text>
              <Text style={styles.cell}>Remarks</Text>
            </View>

            {medicines.map((m, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.cell, { flex: 1.5 }]}>{m.name}</Text>
                <Text style={styles.cell}>{m.dose}</Text>
                <Text style={styles.cell}>{m.frequency.join(", ")}</Text>
                <Text style={styles.cell}>{m.duration}</Text>
                <Text style={styles.cell}>{m.remarks}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
