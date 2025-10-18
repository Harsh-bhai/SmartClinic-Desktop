import {Route, Routes} from "react-router-dom"
import AppointmentsPage from "./pages/AppointmentsPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import PrescriptionPage from "./pages/PrescriptionPage"
import RolesAndAccessPage from "./pages/RolesAndAccessPage"
import PatientsPage from "./pages/PatientsPage"
import FormSettingsPage from "./pages/FormSettingsPage"
import MessagesPage from "./pages/MessagesPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MedicineInventoryPage from "./features/medicineInventory/MedicineInventoryPage"

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/prescription" element={<PrescriptionPage />} />
        <Route path="/roles-and-access" element={<RolesAndAccessPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/form-settings" element={<FormSettingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/medicine-inventory" element={<MedicineInventoryPage />} />
    </Routes>
  )
}

export default AppRoutes