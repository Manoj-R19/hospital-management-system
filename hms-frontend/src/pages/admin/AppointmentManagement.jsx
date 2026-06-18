import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  Filter,
  X,
  PlusCircle,
  CalendarCheck
} from 'lucide-react';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  
  const [rescheduleForm, setRescheduleForm] = useState({
    appointmentDate: '',
    appointmentTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, docsRes, patsRes] = await Promise.all([
        adminApi.getAllAppointments(),
        adminApi.getAllDoctors(),
        adminApi.getAllPatients()
      ]);
      setAppointments(apptsRes.data);
      setDoctors(docsRes.data.filter(d => d.isVerified)); // only verified doctors can accept appointments
      setPatients(patsRes.data);
    } catch (error) {
      toast.error('Failed to load appointments registry');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminApi.updateAppointmentStatus(id, { status });
      toast.success(`Appointment status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createAppointment(createForm);
      toast.success('Appointment created successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({ patientId: '', doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule appointment');
    }
  };

  const openRescheduleModal = (appt) => {
    setSelectedAppointment(appt);
    setRescheduleForm({
      appointmentDate: appt.appointmentDate || '',
      appointmentTime: appt.appointmentTime || ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateAppointmentStatus(selectedAppointment.id, {
        status: 'APPROVED',
        appointmentDate: rescheduleForm.appointmentDate,
        appointmentTime: rescheduleForm.appointmentTime
      });
      toast.success('Appointment rescheduled successfully');
      setIsRescheduleModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Reschedule failed');
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === 'ALL') return true;
    return appt.status === activeTab;
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Appointments Desk</h1>
          <p className="text-slate-500 mt-1">Review, authorize, and reschedule hospital clinical appointments</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          <PlusCircle size={16} /> Book Appointment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-sm font-semibold">
        {['ALL', 'PENDING', 'APPROVED', 'CANCELLED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 transition-all border-b-2
              ${activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Registry Cards/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map(appt => (
          <div key={appt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            {/* Top row status */}
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                ${appt.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : ''}
                ${appt.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' : ''}
                ${appt.status === 'CANCELLED' || appt.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' : ''}
              `}>
                {appt.status}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">ID: {appt.id.slice(0, 8)}</span>
            </div>

            {/* Details */}
            <div className="space-y-3 flex-1 mb-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">P</div>
                <div>
                  <p className="font-bold text-slate-800">{appt.patient?.fullName}</p>
                  <p className="text-[10px] text-slate-400">Aadhaar last 4: {appt.patient?.aadhaarLast4}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">D</div>
                <div>
                  <p className="font-semibold text-slate-700">{appt.doctor?.fullName}</p>
                  <p className="text-[10px] text-slate-400">{appt.doctor?.specialization}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={14} className="text-slate-400" />
                  {appt.appointmentDate}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} className="text-slate-400" />
                  {appt.appointmentTime}
                </div>
                {appt.reason && (
                  <p className="text-xs text-slate-600 font-medium italic mt-1 truncate">"{appt.reason}"</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-150 flex flex-wrap gap-2 text-xs font-bold">
              {appt.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(appt.id, 'APPROVED')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              {appt.status === 'APPROVED' && (
                <>
                  <button 
                    onClick={() => openRescheduleModal(appt)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-150 rounded-lg transition-colors"
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              {(appt.status === 'CANCELLED' || appt.status === 'REJECTED') && (
                <span className="text-center w-full text-slate-400 py-1.5 bg-slate-50 border border-slate-150 rounded-lg">No actions available</span>
              )}
            </div>
          </div>
        ))}
        {filteredAppointments.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
            <div className="flex flex-col items-center">
              <CalendarCheck size={40} className="text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700">No appointments found in this category.</p>
            </div>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-lg overflow-hidden relative flex flex-col">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Book Patient Appointment</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Select Patient</label>
                <select 
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Choose Admitted Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} (Aadhaar last 4: {p.aadhaarLast4})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Select Doctor</label>
                <select 
                  value={createForm.doctorId}
                  onChange={(e) => setCreateForm({ ...createForm, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Choose Verified Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Appointment Date</label>
                  <input 
                    type="date"
                    value={createForm.appointmentDate}
                    onChange={(e) => setCreateForm({ ...createForm, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Time Slot</label>
                  <input 
                    type="time"
                    value={createForm.appointmentTime}
                    onChange={(e) => setCreateForm({ ...createForm, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Reason for Visit</label>
                <textarea 
                  value={createForm.reason}
                  onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
                  placeholder="Clinical symptoms, follow-up consult, etc."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Book Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRescheduleModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-sm overflow-hidden relative flex flex-col">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Reschedule Consultation</h3>
              <button onClick={() => setIsRescheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">New Date</label>
                <input 
                  type="date"
                  value={rescheduleForm.appointmentDate}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">New Time Slot</label>
                <input 
                  type="time"
                  value={rescheduleForm.appointmentTime}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="px-4 py-1.5 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Update Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
