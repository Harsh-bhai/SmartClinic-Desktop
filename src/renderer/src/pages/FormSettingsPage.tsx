import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function FormSettingsPage({ onSave }: { onSave: (config: any) => void }) {
  const [config, setConfig] = useState({
    patient: { name: true, age: true, medicalHistory: true, lifestyleHabits: true },
    medicines: { medicineName: true, dose: true, frequency: true, duration: true, remarks: true },
  })

  const toggleField = (tab: string, field: string) => {
    setConfig((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: !prev[tab][field] },
    }))
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Form Settings</h2>

      {Object.entries(config).map(([tab, fields]) => (
        <div key={tab} className="mb-6">
          <h3 className="font-semibold mb-2">{tab.toUpperCase()}</h3>
          {Object.entries(fields).map(([field, value]) => (
            <div key={field} className="flex items-center space-x-2 mb-2">
              <Checkbox
                checked={value}
                onCheckedChange={() => toggleField(tab, field)}
              />
              <span>{field}</span>
            </div>
          ))}
        </div>
      ))}

      <Button onClick={() => onSave(config)}>Save Settings</Button>
    </div>
  )
}
