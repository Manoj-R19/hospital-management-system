import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import DoctorLogin from './pages/auth/DoctorLogin';
import DoctorRegister from './pages/auth/DoctorRegister';
import PatientLogin from './pages/auth/PatientLogin';
import PatientRegister from './pages/auth/PatientRegister';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorList from './pages/admin/DoctorList';
import RegisterDoctor from './pages/admin/RegisterDoctor';
import PatientManagement from './pages/admin/PatientManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import BillingPage from './pages/admin/BillingPage';
import HospitalProfilePage from './pages/admin/HospitalProfilePage';
import RolesPage from './pages/admin/RolesPage';
import ReportsPage from './pages/admin/ReportsPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';

import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import SearchPatient from './pages/doctor/SearchPatient';
import PatientHistory from './pages/doctor/PatientHistory';
import CreateEncounter from './pages/doctor/CreateEncounter';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorReports from './pages/doctor/DoctorReports';
import DoctorSettings from './pages/doctor/DoctorSettings';

import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import MyReminders from './pages/patient/MyReminders';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientMedicines from './pages/patient/PatientMedicines';
import PatientReports from './pages/patient/PatientReports';
import PatientVisitHistory from './pages/patient/PatientHistory';
import PatientNotifications from './pages/patient/PatientNotifications';
import PatientSupport from './pages/patient/PatientSupport';
import PatientSettings from './pages/patient/PatientSettings';
import RegisterRoleSelection from './pages/auth/RegisterRoleSelection';

import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import EmergencyRequestPage from './pages/bloodbank/EmergencyRequestPage';
import StockManagementPage from './pages/bloodbank/StockManagementPage';
import BloodDonorPage from './pages/bloodbank/BloodDonorPage';

import { Activity, Stethoscope, HeartPulse } from 'lucide-react';

const RoleSelection = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    {/* Decorative background blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
    
    <div className="text-center mb-16 relative z-10">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
          <Activity className="w-10 h-10 text-brand-600" />
        </div>
      </div>
      <h1 className="text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-4">CureWell <span className="text-brand-600">HMS</span></h1>
      <p className="text-lg text-slate-500 max-w-md mx-auto">Select your portal to securely access the healthcare management system.</p>
    </div>

    <div className="flex flex-col md:flex-row gap-6 relative z-10 w-full max-w-4xl justify-center">
      <a href="/login/admin" className="premium-card p-8 flex flex-col items-center group w-full md:w-72">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Activity className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Administrator</h3>
        <p className="text-sm text-slate-500 text-center">Manage operations, doctors, and system configuration</p>
      </a>
      
      <a href="/login/doctor" className="premium-card p-8 flex flex-col items-center group w-full md:w-72 border-teal-100 hover:border-teal-300">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Stethoscope className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Doctor</h3>
        <p className="text-sm text-slate-500 text-center">Access EMR, patient history, and create prescriptions</p>
      </a>

      <a href="/login/patient" className="premium-card p-8 flex flex-col items-center group w-full md:w-72 border-blue-100 hover:border-blue-300">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <HeartPulse className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Patient</h3>
        <p className="text-sm text-slate-500 text-center">View prescriptions, records, and set medicine reminders</p>
      </a>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/register/admin" element={<AdminRegister />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/patient" element={<PatientRegister />} />
      <Route path="/register" element={<RegisterRoleSelection />} />

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/register" element={<RegisterDoctor />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="profile" element={<HospitalProfilePage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="blood-bank" element={<BloodBankDashboard />} />
        <Route path="blood-bank/requests" element={<EmergencyRequestPage />} />
        <Route path="blood-bank/stock" element={<StockManagementPage />} />
        <Route path="blood-bank/donors" element={<BloodDonorPage />} />
      </Route>

      <Route path="/doctor/*" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="search" element={<SearchPatient />} />
        <Route path="patient/:aadhaar" element={<PatientHistory />} />
        <Route path="patient/:aadhaar/encounter/new" element={<CreateEncounter />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="reports" element={<DoctorReports />} />
        <Route path="settings" element={<DoctorSettings />} />
        <Route path="blood-bank" element={<BloodBankDashboard />} />
        <Route path="blood-bank/requests" element={<EmergencyRequestPage />} />
        <Route path="blood-bank/stock" element={<StockManagementPage />} />
        <Route path="blood-bank/donors" element={<BloodDonorPage />} />
      </Route>

      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <PatientLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="reminders" element={<MyReminders />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="medicines" element={<PatientMedicines />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="history" element={<PatientVisitHistory />} />
        <Route path="notifications" element={<PatientNotifications />} />
        <Route path="support" element={<PatientSupport />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
