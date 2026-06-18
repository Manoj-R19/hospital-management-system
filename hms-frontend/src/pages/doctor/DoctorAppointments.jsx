import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { toast } from 'react-hot-toast';
import { 
  Search, Filter, Calendar, Clock, ChevronRight, Stethoscope, 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye
} from 'lucide-react';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppt, setSelectedAppt] = useState(null);
  
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const mockAppts = [
    { id: 'a1', patientName: 'Vikram Singh', age: 41, gender: 'Male', time: '18:30', date: '2026-06-18', reason: 'Chest Discomfort', status: 'CHECKED_IN', aadhaar: '888899990000', phone: '8877665544' },
    { id: 'a2', patientName: 'Rohan Mehta', age: 34, gender: 'Male', time: '19:00', date: '2026-06-18', reason: 'Chronic Dry Cough', status: 'CHECKED_IN', aadhaar: '123456789012', phone: '9876543210' },
    { id: 'a3', patientName: 'Amit Patel', age: 52, gender: 'Male', time: '19:30', date: '2026-06-18', reason: 'Diabetes Refill', status: 'PENDING', aadhaar: '987654321098', phone: '9081726354' },
    { id: 'a4', patientName: 'Priya Sharma', age: 28, gender: 'Female', time: '16:00', date: '2026-06-18', reason: 'Severe Migraine', status: 'COMPLETED', aadhaar: '111122223333', phone: '9123456789' },
    { id: 'a5', patientName: 'Kunal Kapoor', age: 45, gender: 'Male', time: '10:00', date: '2026-06-19', reason: 'Hypertension Check', status: 'PENDING', aadhaar: '444455556666', phone: '9234567890' },
    { id: 'a6', patientName: 'Sneha Reddy', age: 31, gender: 'Female', time: '11:30', date: '2026-06-19', reason: 'Gastric Pain', status: 'CANCELLED', aadhaar: '555566667777', phone: '9345678901' },
    { id: 'a7', patientName: 'Rajesh Nair', age: 60, gender: 'Male', time: '14:00', date: '2026-06-20', reason: 'Arthritis Review', status: 'PENDING', aadhaar: '777788889999', phone: '9456789012' }
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getAppointments();
      if (res.data && res.data.length > 0) {
        // Map database response to consistent format
        const mapped = res.data.map(a => ({
          id: a.id,
          patientName: a.patient?.fullName || 'N/A',
          age: a.patient?.age || 'N/A',
          gender: a.patient?.gender || 'N/A',
          time: a.appointmentTime ? a.appointmentTime.substring(0, 5) : 'N/A',
          date: a.appointmentDate || 'N/A',
          reason: a.reason || 'N/A',
          status: a.status || 'PENDING',
          aadhaar: a.patient?.aadhaar || '',
          phone: a.patient?.phoneNumber || ''
        }));
        setAppointments(mapped);
      } else {
        setAppointments(mockAppts);
      }
    } catch (error) {
      console.warn('API error fetching appointments. Loading mock dataset.', error);
      setAppointments(mockAppts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      if (id.length === 36 || id.includes('-')) {
        await doctorApi.updateAppointmentStatus(id, { status });
      }
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Appointment marked as ${status}`);
    } catch (e) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status} (Demo Mode)`);
    }
  };

  const openRescheduleModal = (appt) => {
    setSelectedAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.time);
    setShowRescheduleModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      if (selectedAppt.id.length === 36 || selectedAppt.id.includes('-')) {
        await doctorApi.updateAppointmentStatus(selectedAppt.id, {
          status: 'PENDING',
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime + ':00'
        });
      }
      setAppointments(appointments.map(a => 
        a.id === selectedAppt.id 
          ? { ...a, date: rescheduleDate, time: rescheduleTime, status: 'PENDING' } 
          : a
      ));
      toast.success('Appointment rescheduled successfully');
      setShowRescheduleModal(false);
    } catch (err) {
      setAppointments(appointments.map(a => 
        a.id === selectedAppt.id 
          ? { ...a, date: rescheduleDate, time: rescheduleTime, status: 'PENDING' } 
          : a
      ));
      toast.success('Rescheduled successfully (Demo Mode)');
      setShowRescheduleModal(false);
    }
  };

  const filtered = appointments.filter(a => {
    const matchesSearch = 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.aadhaar.includes(searchTerm) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-650" /> Appointment Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review scheduled slots, reschedule consultations, and check-in patient records.</p>
        </div>
        <button 
          onClick={fetchAppointments}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-250 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload List
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient name, Aadhaar or complaint..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Count indicators */}
        <div className="flex items-center justify-end px-2 text-xs font-bold text-slate-500">
          Showing {filtered.length} of {appointments.length} Appointments
        </div>
      </div>

      {/* Appointments Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Appointments Found</h3>
            <p className="text-xs text-slate-450 mt-1">Try relaxing your search terms or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider font-bold bg-slate-50/50">
                  <th className="py-3.5 px-6">Schedule</th>
                  <th className="py-3.5 px-6">Patient Info</th>
                  <th className="py-3.5 px-6">Aadhaar</th>
                  <th className="py-3.5 px-6">Reason for Visit</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{appt.date}</span>
                        <span className="text-[10px] text-teal-650 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {appt.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
                          {appt.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{appt.patientName}</p>
                          <span className="text-[10px] text-slate-450 font-medium">{appt.age} Yrs • {appt.gender}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-medium text-slate-500">{appt.aadhaar}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-650 font-medium">{appt.reason}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        appt.status === 'CHECKED_IN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        appt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {appt.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => navigate(`/doctor/patient/${appt.aadhaar}`)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                          title="View Records"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                          <>
                            <button 
                              onClick={() => navigate('/doctor/dashboard')}
                              className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold border border-teal-200 transition-colors"
                            >
                              Consult
                            </button>
                            <button 
                              onClick={() => openRescheduleModal(appt)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 transition-colors"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                        {appt.status === 'PENDING' && (
                          <button 
                            onClick={() => handleUpdateStatus(appt.id, 'CHECKED_IN')}
                            className="p-1.5 text-indigo-650 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            title="Check In Patient"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-teal-600" /> Reschedule Appointment
              </h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleReschedule} className="p-5 space-y-4">
              <p className="text-xs text-slate-500">Rescheduling consultation for <span className="font-bold text-slate-700">{selectedAppt.patientName}</span>.</p>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">New Date</label>
                <input 
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">New Time Slot</label>
                <input 
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md shadow-teal-500/20"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
