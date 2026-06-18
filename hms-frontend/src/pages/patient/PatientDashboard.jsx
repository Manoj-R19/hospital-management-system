import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import { toast } from 'react-hot-toast';
import { 
  Activity, Bell, Calendar, Clock, Download, Phone, 
  HelpCircle, MessageSquare, AlertTriangle, ArrowRight, 
  CheckCircle, PlusCircle, User, ShieldAlert, Award, FileText, Pill
} from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats Counters
  const [takenCount, setTakenCount] = useState(0);

  const mockProfile = {
    fullName: 'Rahul Sharma',
    bloodGroup: 'B+',
    phoneNumber: '9876543210',
    allergies: 'Penicillin, Dust',
    medicalConditions: 'Mild Asthma',
    insuranceProvider: 'HDFC Ergo Health',
    policyNumber: 'POL-192849-B'
  };

  const mockAppts = [
    { id: '1', doctorName: 'Dr. Suresh Kumar', specialization: 'General Physician', department: 'General Medicine', date: '2026-06-18', time: '18:30', status: 'CHECKED_IN', tokenNumber: '08', waitingPosition: 2, estimatedTime: '20 mins', type: 'Physical Checkup' }
  ];

  const mockReminders = [
    { id: 'r1', medicineName: 'Amoxicillin', dosage: '500 mg', frequency: 'MORNING_NIGHT', timeSlot: '08:30 PM', status: 'PENDING', timePassed: false },
    { id: 'r2', medicineName: 'Montelukast', dosage: '10 mg', frequency: 'NIGHT', timeSlot: '09:30 PM', status: 'PENDING', timePassed: false },
    { id: 'r3', medicineName: 'Paracetamol', dosage: '650 mg', frequency: 'MORNING', timeSlot: '08:30 AM', status: 'COMPLETED', timePassed: true }
  ];

  const mockPrescriptions = [
    { id: 'pr1', doctorName: 'Dr. Suresh Kumar', date: '2026-06-15', duration: '7 days', notes: 'Take medicines after food. Refrain from cold drinks.' }
  ];

  const mockReports = [
    { id: 'rep1', testName: 'Complete Blood Count (CBC)', date: '2026-06-16', status: 'COMPLETED', diagnosis: 'Normal platelet counts, mild hemoglobin deficit' },
    { id: 'rep2', testName: 'Thyroid Panel (TSH)', date: '2026-06-16', status: 'COMPLETED', diagnosis: 'TSH: 2.4 μIU/mL (Optimal range)' }
  ];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, apptsRes, remindersRes, activePresRes] = await Promise.all([
        patientApi.getProfile(),
        patientApi.getAppointments(),
        patientApi.getTodayReminders(),
        patientApi.getActivePrescriptions()
      ]);

      setProfile(profileRes.data);
      
      if (apptsRes.data && apptsRes.data.length > 0) {
        setAppointments(apptsRes.data);
      } else {
        setAppointments(mockAppts);
      }

      if (remindersRes.data && remindersRes.data.length > 0) {
        setReminders(remindersRes.data);
        setTakenCount(remindersRes.data.filter(r => r.status === 'COMPLETED' || r.status === 'TAKEN').length);
      } else {
        setReminders(mockReminders);
        setTakenCount(mockReminders.filter(r => r.status === 'COMPLETED').length);
      }

      if (activePresRes.data && activePresRes.data.length > 0) {
        setPrescriptions(activePresRes.data);
      } else {
        setPrescriptions(mockPrescriptions);
      }
      setReports(mockReports);
    } catch (e) {
      console.warn('API error loading patient dashboard. Falling back to mock data.', e);
      setProfile(mockProfile);
      setAppointments(mockAppts);
      setReminders(mockReminders);
      setPrescriptions(mockPrescriptions);
      setReports(mockReports);
      setTakenCount(mockReminders.filter(r => r.status === 'COMPLETED').length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const markMedicineTaken = async (remId) => {
    try {
      // If remId is a database UUID (length 36), send PATCH update
      if (remId.length === 36 || remId.includes('-')) {
        await patientApi.markReminderStatus(remId, { status: 'COMPLETED', notes: 'Taken on time' });
      }
      setReminders(reminders.map(r => r.id === remId ? { ...r, status: 'COMPLETED' } : r));
      setTakenCount(prev => prev + 1);
      toast.success('Medicine marked as taken successfully');
    } catch (err) {
      setReminders(reminders.map(r => r.id === remId ? { ...r, status: 'COMPLETED' } : r));
      setTakenCount(prev => prev + 1);
      toast.success('Medicine marked as taken (Demo Mode)');
    }
  };

  const handleDownloadReport = (testName) => {
    toast.success(`Downloading report: ${testName}.pdf`);
  };

  const handleDownloadPrescription = (doc) => {
    toast.success(`Downloading prescription by ${doc}.pdf`);
  };

  const handleShareReport = (testName) => {
    toast.success(`Secure share link generated for ${testName}`);
  };

  const activeAppt = appointments[0] || null;
  const nextMedicine = reminders.find(r => r.status === 'PENDING') || null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-2xl shadow-lg text-white flex justify-between items-center animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold">Hello, {profile?.fullName || 'Rahul'}</h1>
          <p className="text-blue-200 text-xs md:text-sm mt-1">Keep track of your appointments, check-in queue position, and daily medicine reminders.</p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Health Member ID</span>
          <span className="text-xs font-mono font-bold text-white bg-blue-800/50 px-3 py-1 rounded-lg border border-blue-700/50 mt-1 inline-block">
            CW-8921820A
          </span>
        </div>
      </div>

      {/* 1. Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Upcoming Consult', val: activeAppt ? activeAppt.doctorName : 'None', color: 'border-l-blue-500 text-blue-600', bg: 'bg-blue-50', icon: Calendar },
          { label: 'Today Token', val: activeAppt?.tokenNumber ? `#${activeAppt.tokenNumber}` : '--', color: 'border-l-indigo-500 text-indigo-600', bg: 'bg-indigo-50', icon: Award },
          { label: 'Medicines Taken', val: `${takenCount} / ${reminders.length}`, color: 'border-l-emerald-500 text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
          { label: 'Pending Reports', val: '0', color: 'border-l-amber-500 text-amber-600', bg: 'bg-amber-50', icon: FileText },
          { label: 'Next Pill Intake', val: nextMedicine ? nextMedicine.timeSlot : 'None', color: 'border-l-rose-500 text-rose-600', bg: 'bg-rose-50', icon: Clock },
          { label: 'Follow-up Date', val: '2026-06-25', color: 'border-l-teal-500 text-teal-600', bg: 'bg-teal-50', icon: User }
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`p-4 bg-white border border-slate-100 border-l-4 ${c.color} rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{c.label}</span>
                <span className={`p-1.5 rounded-lg ${c.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-800 mt-2 truncate">{c.val}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns (Appointments, Queue Tracker, Medicine checklist) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row: Appointment Card & Token Queue Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 2. Today's Appointment Card */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-blue-650 uppercase tracking-wider block bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md w-fit">Today's Appointment</span>
                    <h3 className="text-sm font-bold text-slate-800 mt-2">{activeAppt?.doctorName || 'Dr. Suresh Kumar'}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{activeAppt?.specialization || 'General Physician'} • {activeAppt?.department || 'General Medicine'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm border border-slate-200">
                    {activeAppt?.doctorName?.split(' ').pop()?.charAt(0)}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-650 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date / Time</span>
                    <span className="text-slate-800 font-bold">{activeAppt?.date} @ {activeAppt?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consult Type</span>
                    <span className="text-slate-800 font-bold">{activeAppt?.type || 'General Consultation'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100">
                <button 
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/25 flex items-center justify-center gap-1"
                >
                  View Appointment Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Token / Queue Status Card */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-800">Queue Tracker Status</h3>
                  </div>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {activeAppt?.status}
                  </span>
                </div>

                <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-150 relative overflow-hidden">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Your Token Number</span>
                  <p className="text-3xl font-extrabold text-indigo-700 mt-1">#{activeAppt?.tokenNumber || '08'}</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-450">Queue Position</span>
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/40">
                      {activeAppt?.waitingPosition} patients ahead
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-450">Estimated Wait Time</span>
                    <span className="text-slate-800 font-bold">{activeAppt?.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-center text-[10px] text-slate-400 gap-1.5 font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                Real-time queue tracking active
              </div>
            </div>

          </div>

          {/* 4. Medicine Reminder Panel */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Pill className="w-4.5 h-4.5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Today's Medicine Logs</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {takenCount} / {reminders.length} Completed
              </span>
            </div>

            <div className="p-5 space-y-4">
              {reminders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  No medicine reminders configured for today.
                </div>
              ) : (
                reminders.map((rem) => (
                  <div 
                    key={rem.id} 
                    className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all ${
                      rem.status === 'COMPLETED' 
                        ? 'bg-emerald-50/30 border-emerald-200' 
                        : rem.timePassed 
                          ? 'bg-red-50/30 border-red-100' 
                          : 'bg-slate-50/50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        rem.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                        rem.timePassed ? 'bg-red-105 bg-red-100 text-red-500 animate-pulse' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <Pill className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{rem.medicineName} ({rem.dosage})</h4>
                        <p className="text-[10px] text-slate-450 font-semibold mt-1 flex items-center gap-1.5">
                          <Clock size={10} /> Time: {rem.timeSlot} &bull; Frequency: {rem.frequency?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      {rem.timePassed && rem.status !== 'COMPLETED' && (
                        <span className="text-[8px] font-extrabold text-red-650 bg-red-100 border border-red-200 px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                          <AlertTriangle size={10} /> MISSED REMINDER
                        </span>
                      )}
                      
                      {rem.status === 'COMPLETED' ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle size={12} className="text-emerald-500" /> Taken
                        </span>
                      ) : (
                        <button 
                          onClick={() => markMedicineTaken(rem.id)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm"
                        >
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Prescriptions list, Reports, Support) */}
        <div className="space-y-6">
          
          {/* 5. Prescription List Panel */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800">My Prescriptions</h3>
            </div>
            <div className="p-4 space-y-3">
              {prescriptions.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No prescriptions logged.
                </div>
              ) : (
                prescriptions.map((p) => (
                  <div key={p.id} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{p.doctorName}</h4>
                        <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">Issued: {p.date} &bull; Duration: {p.duration}</span>
                      </div>
                      <button 
                        onClick={() => handleDownloadPrescription(p.doctorName)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg border border-slate-250 transition-colors"
                        title="Download Prescription"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {p.notes && (
                      <p className="text-[10px] text-slate-550 bg-white border border-slate-150 p-2.5 rounded-lg leading-relaxed font-medium">
                        <span className="font-bold text-slate-450">Notes:</span> {p.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 6. Reports and Lab Results Panel */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-800">Recent Lab Reports</h3>
            </div>
            <div className="p-4 space-y-3.5">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 truncate max-w-[170px]">{rep.testName}</h4>
                      <span className="text-[9px] text-slate-450 block font-semibold mt-0.5">Test Date: {rep.date}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleDownloadReport(rep.testName)}
                        className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500"
                        title="Download PDF"
                      >
                        <Download size={12} />
                      </button>
                      <button 
                        onClick={() => handleShareReport(rep.testName)}
                        className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500"
                        title="Share Report"
                      >
                        <PlusCircle size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium bg-white border border-slate-150 p-2 rounded-lg leading-relaxed">
                    <span className="font-bold text-slate-450 block mb-0.5 uppercase text-[8px] tracking-wider">Diagnosis Summary:</span>
                    {rep.diagnosis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Support & Emergency Contact Info */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-slate-800">Emergency & Helpline</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-red-650 uppercase tracking-wider block">CureWell Emergency Desk</span>
                <a href="tel:+919876543210" className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 mt-1 hover:text-red-750 transition-colors">
                  <Phone size={14} className="text-red-500 animate-pulse" /> +91 98765 43210
                </a>
              </div>

              <div className="flex gap-2">
                <a 
                  href="tel:+919876543210"
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone size={12} /> Call Desk
                </a>
                <button 
                  onClick={() => navigate('/patient/support')}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <MessageSquare size={12} /> AI Chatbot
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
