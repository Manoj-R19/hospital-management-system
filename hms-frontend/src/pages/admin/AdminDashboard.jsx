import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  HeartPulse, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Activity,
  Plus,
  Receipt,
  FileDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Droplet
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    revenue: 0,
    pendingRequests: 0,
    todayActivity: 0
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, doctorsRes, patientsRes, apptsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAllDoctors(),
        adminApi.getAllPatients(),
        adminApi.getAllAppointments()
      ]);

      setStats(statsRes.data);
      setRecentDoctors(doctorsRes.data.slice(-5).reverse());
      setRecentPatients(patientsRes.data.slice(-5).reverse());
      setRecentAppointments(apptsRes.data.slice(-5).reverse());
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (id) => {
    try {
      await adminApi.verifyDoctor(id);
      toast.success('Doctor verified successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-4 border-l-blue-600' },
    { label: 'Total Patients', value: stats.totalPatients, icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-l-4 border-l-teal-600' },
    { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-l-4 border-l-indigo-600' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-4 border-l-emerald-600' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-4 border-l-amber-600' },
    { label: 'Today\'s Activity', value: stats.todayActivity, icon: Activity, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-4 border-l-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800">System Overview</h1>
        <p className="text-slate-500 mt-1">CureWell General Hospital Operations Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between ${card.border}`}>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-display font-extrabold text-slate-800">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-blue-600" />
          Quick Action Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button onClick={() => navigate('/admin/doctors/register')} className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl border border-blue-100 transition-all">
            <Plus size={16} /> Add Doctor
          </button>
          <button onClick={() => navigate('/admin/patients')} className="flex items-center justify-center gap-2 p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-sm rounded-xl border border-teal-100 transition-all">
            <Plus size={16} /> Add Patient
          </button>
          <button onClick={() => navigate('/admin/appointments')} className="flex items-center justify-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-100 transition-all">
            <Plus size={16} /> Create Appointment
          </button>
          <button onClick={() => navigate('/admin/billing')} className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-100 transition-all">
            <Receipt size={16} /> Generate Bill
          </button>
          <button onClick={() => navigate('/admin/reports')} className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all">
            <FileDown size={16} /> Export Report
          </button>
          <button onClick={() => navigate('/admin/blood-bank')} className="flex items-center justify-center gap-2 p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm rounded-xl border border-rose-100 transition-all">
            <Droplet size={16} className="text-red-500 animate-pulse" /> Blood Bank
          </button>
        </div>
      </div>

      {/* Grid of Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-150">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Date/Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{appt.patient?.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{appt.doctor?.fullName}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {appt.appointmentDate} <span className="text-xs text-slate-400">{appt.appointmentTime}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${appt.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${appt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : ''}
                        ${appt.status === 'REJECTED' || appt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : ''}
                      `}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentAppointments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-400">No appointments scheduled.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Verification / Pending Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Doctor Registration Approvals</h3>
            <Link to="/admin/doctors" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              Doctors List <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-150">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Govt Reg No.</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{doc.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{doc.specialization}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{doc.govtRegNumber}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {!doc.isVerified ? (
                        <button 
                          onClick={() => handleVerifyDoctor(doc.id)} 
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold px-3 py-1">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentDoctors.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-400">No doctors registered.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Register Grid List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-800">Recently Admitted Patients</h3>
          <Link to="/admin/patients" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
            View All Patients <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentPatients.map((pat) => (
            <div key={pat.id} className="p-4 border border-slate-150 rounded-xl hover:shadow-md transition-all flex items-center gap-4 bg-slate-50/30">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold text-lg border border-teal-100">
                {pat.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 truncate">{pat.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{pat.email || 'No email'}</p>
                <p className="text-xs text-slate-400 mt-0.5">Phone: {pat.phoneNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                  {pat.gender || 'N/A'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{pat.age} years old</p>
              </div>
            </div>
          ))}
          {recentPatients.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400">No patients admitted yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
