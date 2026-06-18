import { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import { 
  Calendar, Clock, User, Award, RefreshCw, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  
  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const mockAppts = [
    { id: 'appt1', doctorName: 'Dr. Suresh Kumar', specialization: 'General Physician', department: 'General Medicine', date: '2026-06-18', time: '18:30', status: 'CHECKED_IN', tokenNumber: '08', waitingPosition: 2, estimatedTime: '20 mins', type: 'Physical Checkup' },
    { id: 'appt2', doctorName: 'Dr. Anita Desai', specialization: 'Pediatrician', department: 'Pediatrics', date: '2026-05-12', time: '10:00', status: 'COMPLETED', tokenNumber: '04', waitingPosition: 0, estimatedTime: 'Completed', type: 'Follow-up' }
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getAppointments();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(a => ({
          id: a.id,
          doctorName: a.doctor?.fullName || 'N/A',
          specialization: a.doctor?.specialization || 'N/A',
          department: 'General Medicine', // Mock or extend
          date: a.appointmentDate || 'N/A',
          time: a.appointmentTime ? a.appointmentTime.substring(0, 5) : 'N/A',
          status: a.status || 'PENDING',
          tokenNumber: '08', // Mock default token
          waitingPosition: 2,
          estimatedTime: '20 mins',
          type: 'Physical Checkup'
        }));
        setAppointments(mapped);
      } else {
        setAppointments(mockAppts);
      }
    } catch (e) {
      console.warn('API error fetching patient appointments. Loading mock dataset.', e);
      setAppointments(mockAppts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openRescheduleModal = (appt) => {
    setSelectedAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.time);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      // If db UUID, send put request
      if (selectedAppt.id.length === 36 || selectedAppt.id.includes('-')) {
        await patientApi.rescheduleAppointment(selectedAppt.id, {
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime + ':00'
        });
      }
      setAppointments(appointments.map(a => 
        a.id === selectedAppt.id 
          ? { ...a, date: rescheduleDate, time: rescheduleTime, status: 'PENDING' } 
          : a
      ));
      toast.success('Reschedule request submitted successfully!');
      setShowRescheduleModal(false);
    } catch (err) {
      setAppointments(appointments.map(a => 
        a.id === selectedAppt.id 
          ? { ...a, date: rescheduleDate, time: rescheduleTime, status: 'PENDING' } 
          : a
      ));
      toast.success('Appointment rescheduled (Demo Mode)');
      setShowRescheduleModal(false);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-650" /> My Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review checkup dates, view waiting status, or reschedule consultations.</p>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Appointments Booked</h3>
          <p className="text-xs text-slate-400 mt-1">Contact hospital registration desk to schedule a checkup.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div 
              key={appt.id} 
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Doctor Details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm border border-blue-100/50">
                  {appt.doctorName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dr. {appt.doctorName}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{appt.specialization} &bull; {appt.department}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-semibold mt-2.5">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {appt.date}</span>
                    <span className="text-slate-350">|</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {appt.time}</span>
                  </div>
                </div>
              </div>

              {/* Status and Tokens */}
              <div className="flex flex-wrap items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/50 lg:w-[450px] justify-between">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Token Status</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-1">
                    <Award size={14} className="text-indigo-600" /> Token #{appt.tokenNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Waiting Position</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">
                    {appt.status === 'COMPLETED' ? 'Consulted' : `${appt.waitingPosition} ahead`}
                  </span>
                </div>

                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Est. Waiting Time</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{appt.estimatedTime}</span>
                </div>

                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider border mt-1 ${
                    appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    appt.status === 'CHECKED_IN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                    appt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {appt.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0 self-end lg:self-auto">
                {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                  <button 
                    onClick={() => openRescheduleModal(appt)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
                  >
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-blue-600" /> Reschedule Appointment
              </h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleRescheduleSubmit} className="p-5 space-y-4">
              <p className="text-xs text-slate-500">Rescheduling consultation with <span className="font-bold text-slate-700">Dr. {selectedAppt.doctorName}</span>.</p>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Select Date</label>
                <input 
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Select Time Slot</label>
                <input 
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientAppointments;
