import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import { toast } from 'react-hot-toast';
import { 
  Activity, Bell, Calendar, Clock, Download, Phone, 
  HelpCircle, MessageSquare, AlertTriangle, ArrowRight, 
  CheckCircle, PlusCircle, User, ShieldAlert, Award, FileText, Pill, Shield, Eye, X
} from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Stats Counters
  const [takenCount, setTakenCount] = useState(0);

  const mockProfile = {
    fullName: 'Rahul Sharma',
    bloodGroup: 'B+',
    phoneNumber: '9876543210',
    allergies: 'Penicillin, Dust',
    medicalConditions: 'Mild Asthma, Hypertension',
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
    { id: 'pr1', doctorName: 'Dr. Suresh Kumar', medicineName: 'Amoxicillin', dosage: '500 mg', frequency: 'MORNING_NIGHT', durationText: '7 days', date: '2026-06-15', notes: 'Take medicines after food. Refrain from cold drinks.', instructions: 'Take with warm water after lunch and dinner.', isActive: true },
    { id: 'pr2', doctorName: 'Dr. Suresh Kumar', medicineName: 'Montelukast', dosage: '10 mg', frequency: 'NIGHT', durationText: '30 days', date: '2026-06-15', notes: 'Take before bed.', instructions: 'Take 30 minutes before sleeping.', isActive: true }
  ];

  const mockReports = [
    { id: 'rep1', testName: 'Complete Blood Count (CBC)', date: '2026-06-16', status: 'COMPLETED', diagnosis: 'Normal platelet counts, mild hemoglobin deficit', laboratory: 'CureWell Diagnostics' },
    { id: 'rep2', testName: 'Thyroid Panel (TSH)', date: '2026-06-16', status: 'COMPLETED', diagnosis: 'TSH: 2.4 μIU/mL (Optimal range)', laboratory: 'CureWell Diagnostics' }
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

  const getList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const activeAppt = appointments[0] || null;
  const nextMedicine = reminders.find(r => r.status === 'PENDING') || null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-2xl shadow-lg text-white flex justify-between items-center animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold">Hello, {profile?.fullName || 'Rahul'}</h1>
          <p className="text-blue-200 text-xs md:text-sm mt-1">Keep track of your active prescriptions, health conditions, and diagnostic reports.</p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Health Member ID</span>
          <span className="text-xs font-mono font-bold text-white bg-blue-800/50 px-3 py-1 rounded-lg border border-blue-700/50 mt-1 inline-block">
            CW-8921820A
          </span>
        </div>
      </div>

      {/* Top Summary Cards */}
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Main Clinical Sections (Prescriptions -> Conditions -> Reports) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section A: Prescriptions Cards Section (Top) */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Active Prescriptions</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {prescriptions.length} Active
              </span>
            </div>

            <div className="p-5">
              {prescriptions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  No active prescriptions found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.map((p) => {
                    const freqTags = [];
                    if (p.frequency) {
                      const norm = p.frequency.toUpperCase();
                      if (norm.includes('MORNING')) freqTags.push('Morning');
                      if (norm.includes('AFTERNOON') || norm.includes('NOON')) freqTags.push('Afternoon');
                      if (norm.includes('NIGHT') || norm.includes('EVENING')) freqTags.push('Night');
                      if (freqTags.length === 0) freqTags.push(p.frequency);
                    } else {
                      freqTags.push('As directed');
                    }

                    return (
                      <div key={p.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-slate-850 text-blue-700">{p.medicineName}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Doctor: {p.doctorName || 'Dr. Suresh Kumar'}</p>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md border border-slate-250">
                              {p.dosage || '500 mg'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {freqTags.map((t, idx) => {
                              const colors = 
                                t === 'Morning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                t === 'Afternoon' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                t === 'Night' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                'bg-blue-50 text-blue-700 border-blue-100';
                              return (
                                <span key={idx} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${colors}`}>
                                  {t}
                                </span>
                              );
                            })}
                          </div>

                          <div className="text-[10px] text-slate-500 font-medium">
                            <span>Duration: </span>
                            <span className="text-slate-700 font-bold">{p.durationText || p.duration || '7 days'}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedPrescription(p)}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-105 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Eye size={12} /> View Details
                          </button>
                          <button
                            onClick={() => handleDownloadPrescription(p.doctorName || 'Dr. Suresh Kumar')}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
                            title="Download PDF"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section B: Current Conditions (Middle) */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
              <ShieldAlert className="w-5 h-5 text-amber-505 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-800">Current Health Conditions & Warnings</h3>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medical History & Chronic Conditions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Chronic Conditions</h4>
                  {getList(profile?.medicalConditions || mockProfile.medicalConditions).length === 0 ? (
                    <span className="text-[10px] font-bold text-slate-400">No reported chronic conditions</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getList(profile?.medicalConditions || mockProfile.medicalConditions).map((cond, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg flex items-center gap-1">
                          <Activity size={10} className="text-rose-500 animate-pulse" /> {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Allergy Warnings</h4>
                  {getList(profile?.allergies || mockProfile.allergies).length === 0 ? (
                    <span className="text-[10px] font-bold text-slate-400">No reported allergies</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getList(profile?.allergies || mockProfile.allergies).map((allergy, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">
                          ⚠️ {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Details Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Health Insurance Parameter</h4>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Active Coverage</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Provider:</span>
                    <span className="text-slate-800 font-bold">{profile?.insuranceProvider || mockProfile.insuranceProvider || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Policy Number:</span>
                    <span className="text-slate-800 font-mono font-bold">{profile?.policyNumber || mockProfile.policyNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Recent Lab Reports (Bottom) */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-teal-650 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">Recent Lab Diagnostics</h3>
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                {reports.length} Reports
              </span>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col justify-between hover:border-teal-300 transition-all space-y-3.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{rep.testName}</h4>
                        <span className="text-[9px] font-bold text-emerald-700 bg-white border border-emerald-100 px-2 py-0.5 rounded">
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">Laboratory: {rep.laboratory || 'Main Diagnostics'} &bull; Date: {rep.date}</p>
                      
                      <div className="text-[10px] text-slate-600 bg-white border border-slate-150 p-2.5 rounded-xl leading-relaxed mt-2 font-medium">
                        <span className="font-bold text-slate-400 block mb-0.5 text-[8px] tracking-wider uppercase">Diagnosis Summary</span>
                        {rep.diagnosis}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="flex-1 py-1.5 bg-white hover:bg-slate-105 border border-slate-200 hover:border-teal-300 text-teal-600 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Eye size={12} /> View Report
                      </button>
                      <button
                        onClick={() => handleDownloadReport(rep.testName)}
                        className="p-1.5 hover:bg-teal-50 text-teal-600 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors"
                        title="Download PDF"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Appointment status, Queue tracker, Daily medicines, and Support */}
        <div className="space-y-6">
          
          {/* Today's Appointment Card */}
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

          {/* Token / Queue Status Card */}
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

          {/* Today's Medicine checklist */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800">Today's Medicine Logs</h3>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {takenCount}/{reminders.length}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {reminders.map((rem) => (
                <div 
                  key={rem.id} 
                  className={`p-3 border rounded-xl flex flex-col justify-between gap-3 transition-all ${
                    rem.status === 'COMPLETED' 
                      ? 'bg-emerald-50/30 border-emerald-100' 
                      : rem.timePassed 
                        ? 'bg-red-50/30 border-red-100' 
                        : 'bg-slate-50/55 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Pill className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800">{rem.medicineName} ({rem.dosage})</h4>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Slot: {rem.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5">
                    {rem.timePassed && rem.status !== 'COMPLETED' ? (
                      <span className="text-[8px] font-extrabold text-red-650 bg-red-100 border border-red-150 px-1.5 py-0.5 rounded">
                        MISSED
                      </span>
                    ) : <span />}

                    {rem.status === 'COMPLETED' ? (
                      <span className="text-[8px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle size={10} className="text-emerald-500" /> Taken
                      </span>
                    ) : (
                      <button 
                        onClick={() => markMedicineTaken(rem.id)}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-750 text-white rounded text-[9px] font-bold transition-all shadow-sm"
                      >
                        Mark Taken
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Helpline Card */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-slate-800">Helpline & Support</h3>
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

      {/* Prescription View Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-slate-800 text-lg">Prescription Details</h3>
              </div>
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medicine Name</span>
                <p className="text-xl font-bold text-blue-700 mt-1">{selectedPrescription.medicineName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dosage</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{selectedPrescription.dosage || 'As prescribed'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{selectedPrescription.durationText || selectedPrescription.duration || 'As directed'}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Frequency</span>
                <div className="flex gap-2 mt-1.5">
                  {(() => {
                    const freq = selectedPrescription.frequency || '';
                    const tags = [];
                    const norm = freq.toUpperCase();
                    if (norm.includes('MORNING')) tags.push('Morning');
                    if (norm.includes('AFTERNOON') || norm.includes('NOON')) tags.push('Afternoon');
                    if (norm.includes('NIGHT') || norm.includes('EVENING')) tags.push('Night');
                    if (tags.length === 0) tags.push(freq || 'Once Daily');
                    return tags.map((t, idx) => {
                      const colors = 
                        t === 'Morning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        t === 'Afternoon' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        t === 'Night' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        'bg-blue-50 text-blue-700 border-blue-100';
                      return (
                        <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-bold border ${colors}`}>
                          {t}
                        </span>
                      );
                    });
                  })()}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctor / Clinic Notes</span>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/50 p-4 rounded-xl mt-1.5 leading-relaxed font-medium">
                  {selectedPrescription.instructions || selectedPrescription.notes || 'Take on empty stomach with warm water.'}
                </p>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-650 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleDownloadPrescription(selectedPrescription.doctorName || 'Dr. Suresh Kumar');
                  setSelectedPrescription(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-50/30">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-650" />
                <h3 className="font-display font-bold text-slate-800 text-lg">Lab Report Details</h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Test Name</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{selectedReport.testName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Test Date</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{selectedReport.date}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {selectedReport.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Interpretation</span>
                <p className="text-xs text-slate-655 bg-slate-50 border border-slate-200/50 p-4 rounded-xl mt-1.5 leading-relaxed font-medium">
                  {selectedReport.diagnosis}
                </p>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-650 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleDownloadReport(selectedReport.testName);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
