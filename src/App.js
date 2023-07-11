import { Route, Routes } from "react-router-dom";
import "./App.css";
// import Doctor from "./pages/doctor/Doctor";
import NotFound from "./pages/notFound/NotFound";
import ProtectedRoute from "./config/router/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ReceptionTable from "./pages/admin/Reception/ReceptionTable";
import DoctorTable from "./pages/admin/Doctor/DoctorTable";
import DepartmentTable from "./pages/admin/Department/DepartmentTable";
import Login from "./pages/login/login";
import AppointmentsTable from "./pages/admin/Appointments/AppointmentsTable";
import ReceptionisteLayout from "./pages/receptioniste/ReceptionisteLayout";
import ReceptionData from "./pages/receptioniste/ReceptionistData/ReceptionData";
import PatientTable from "./pages/receptioniste/patient/PatientTable";
import AppointmentTable from "./pages/receptioniste/appointment/AppointmentTable";
import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorData from "./pages/doctor/doctorData/DoctorData";
import DoctorAppointment from "./pages/doctor/doctorAppointments/DoctorAppointment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />x{" "}
      <Route
        path="/admin"
        element={<ProtectedRoute role="admin" element={<AdminLayout />} />}
      >
        <Route path="receptionistes" element={<ReceptionTable />} />
        <Route path="doctors" element={<DoctorTable />} />
        <Route path="departments" element={<DepartmentTable />} />
        <Route path="appointments" element={<AppointmentsTable />} />
      </Route>
      <Route
        path="/reception"
        element={
          <ProtectedRoute role="reception" element={<ReceptionisteLayout />} />
        }
      >
        <Route path="myInfo" element={<ReceptionData />} />
        <Route path="patient" element={<PatientTable />} />
        <Route path="appointments" element={<AppointmentTable />} />
      </Route>
      <Route
        path="/doctor"
        element={<ProtectedRoute role="doctor" element={<DoctorLayout />} />}
      >
        <Route path="myInfo" element={<DoctorData />} />
        <Route path="doctorAppointment" element={<DoctorAppointment />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
