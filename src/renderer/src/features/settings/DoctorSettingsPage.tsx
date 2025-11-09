import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/provider/ThemeProvider";

export default function DoctorSettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    doctorName: "",
    qualification: "",
    hospitalName: "",
    contactNumber: "",
    registrationNo: "",
    licenseNo: "",
    timings: "",
    address: "",
    // logo: "",
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("doctor_settings");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save data persistently
  const handleSave = () => {
    localStorage.setItem("doctor_settings", JSON.stringify(formData));
  };

  // Handle image upload
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-neutral-950" : "bg-gray-100"
      }`}
    >
      <Card
        className={`w-[700px] shadow-2xl ${
          isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            🏥 Doctor & Clinic Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Doctor Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Doctor Name</label>
              <Input
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Qualification</label>
              <Input
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="BDS, MDS (Orthodontics)"
              />
            </div>
          </div>

          {/* Hospital Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Hospital Name</label>
              <Input
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                placeholder="Smile Dental Clinic"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Number</label>
              <Input
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Registration / License */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Registration No.</label>
              <Input
                value={formData.registrationNo}
                onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                placeholder="CG/DENTAL/12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">License No.</label>
              <Input
                value={formData.licenseNo}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                placeholder="DL/2025/6789"
              />
            </div>
          </div>

          {/* Timings + Address */}
          <div>
            <label className="block text-sm font-medium">Timings</label>
            <Input
              value={formData.timings}
              onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              placeholder="Mon–Sat: 10AM – 7PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Clinic Address</label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, Raipur, Chhattisgarh"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Hospital Logo</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                <span
                  className={`inline-block px-4 py-2 rounded-md ${
                    isDark
                      ? "bg-neutral-800 hover:bg-neutral-700 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Upload Logo
                </span>
              </label>

              {/* {formData.logo && (
                <img
                  src={formData.logo}
                  alt="Logo Preview"
                  className="w-16 h-16 object-cover rounded-md border border-gray-400"
                />
              )} */}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setFormData({
                  doctorName: "",
                  qualification: "",
                  hospitalName: "",
                  contactNumber: "",
                  registrationNo: "",
                  licenseNo: "",
                  timings: "",
                  address: "",
                //   logo: "",
                })
              }
            >
              Reset
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
