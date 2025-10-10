import { type Medicine } from "@shared/schemas/patient.schema";

interface MedicinesTableProps {
  medicines: Medicine[];
  onEdit?: (medicine: Medicine, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function MedicinesTable({
  medicines,
  onEdit,
  onDelete,
}: MedicinesTableProps) {
  if (!medicines || medicines.length === 0) {
    return <p className="text-sm text-gray-500">No medicines added yet.</p>;
  }

  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-3 py-2 text-left">#</th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            Medicine
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            Dosage
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            Frequency
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            Duration
          </th>
          <th className="border border-gray-300 px-3 py-2 text-left">
            Remarks
          </th>
          {(onEdit || onDelete) && (
            <th className="border border-gray-300 px-3 py-2 text-center">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {medicines.map((med, idx) => (
          <tr key={idx}>
            <td className="border border-gray-300 px-3 py-2">{idx + 1}</td>
            <td className="border border-gray-300 px-3 py-2">{med.name}</td>
            <td className="border border-gray-300 px-3 py-2">{med.dose}</td>
            <td className="border border-gray-300 px-3 py-2">
              {med.frequency}
            </td>
            <td className="border border-gray-300 px-3 py-2">
              {med.duration || "-"}
            </td>
            <td className="border border-gray-300 px-3 py-2">
              {med.remarks || "-"}
            </td>
            {(onEdit || onDelete) && (
              <td className="border border-gray-300 px-3 py-2 text-center space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(med, idx)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(idx)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
