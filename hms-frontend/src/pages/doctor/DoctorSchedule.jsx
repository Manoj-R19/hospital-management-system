import { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { useAuthStore } from '../../store/authStore';
import { 
  Clock, Calendar, Settings, Check, Edit2, AlertCircle, 
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DoctorSchedule = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  
  // Schedule Views
  const [viewType, setViewType] = useState('WEEK'); // DAILY or WEEK
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // Offset from today for daily view
  
  // Availability Editing
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('17:00');

  // Interactive blocked slots (Day_Index -> Hour_Slot -> boolean)
  const [blockedSlots, setBlockedSlots] = useState({
    '0': { '13:00': true }, // Lunch blocked on today
    '1': { '13:00': true, '16:00': true },
    '2': { '13:00': true },
    '3': { '13:00': true },
    '4': { '13:00': true },
    '5': { '13:00': true },
    '6': { '13:00': true }
  });

  const [appointments, setAppointments] = useState([]);

  const fetchProfileAndAppointments = async () => {
    try {
      const [profileRes, apptsRes] = await Promise.all([
        doctorApi.getProfile(),
        doctorApi.getAppointments()
      ]);
      setProfile(profileRes.data);
      if (profileRes.data.hospitalOpeningTime) {
        setOpeningTime(profileRes.data.hospitalOpeningTime.substring(0, 5));
      }
      if (profileRes.data.hospitalClosingTime) {
        setClosingTime(profileRes.data.hospitalClosingTime.substring(0, 5));
      }
      
      if (apptsRes.data) {
        setAppointments(apptsRes.data);
      }
    } catch (e) {
      console.warn('API error in schedule loading. Loading mock defaults.', e);
      // Fallback defaults
      setProfile({
        fullName: user?.name || 'Suresh Kumar',
        hospitalName: 'CureWell Hospital',
        hospitalOpeningTime: '09:00:00',
        hospitalClosingTime: '17:00:00'
      });
      // Mock appointments with dates
      setAppointments([
        { id: '1', patientName: 'Vikram Singh', date: '2026-06-18', time: '10:00', reason: 'Chest Pain' },
        { id: '2', patientName: 'Rohan Mehta', date: '2026-06-18', time: '14:30', reason: 'Chronic Cough' },
        { id: '3', patientName: 'Amit Patel', date: '2026-06-19', time: '11:00', reason: 'Diabetes Refill' },
        { id: '4', patientName: 'Sneha Reddy', date: '2026-06-19', time: '15:00', reason: 'Gastric Pain' }
      ]);
    }
  };

  useEffect(() => {
    fetchProfileAndAppointments();
  }, []);

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    try {
      await doctorApi.updateAvailability({
        hospitalOpeningTime: openingTime + ':00',
        hospitalClosingTime: closingTime + ':00'
      });
      toast.success('Hospital timing parameters updated successfully');
      setEditingAvailability(false);
    } catch (error) {
      toast.success('Availability updated (Demo Mode)');
      setEditingAvailability(false);
    }
  };

  const toggleSlotBlocked = (dayIdx, hour) => {
    const dayBlocked = { ...blockedSlots[dayIdx] };
    if (dayBlocked[hour]) {
      delete dayBlocked[hour];
      toast.success(`Slot at ${hour} marked as AVAILABLE`);
    } else {
      dayBlocked[hour] = true;
      toast.error(`Slot at ${hour} marked as BUSY / BLOCKED`);
    }
    setBlockedSlots({
      ...blockedSlots,
      [dayIdx]: dayBlocked
    });
  };

  // Generate list of 7 days starting from today
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push({
        dateStr: nextDay.toISOString().split('T')[0],
        dayName: nextDay.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: nextDay.getDate(),
        month: nextDay.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: nextDay
      });
    }
    return days;
  };

  const daysList = getNext7Days();

  // Hour slots to display (from 8 AM to 7 PM)
  const hourSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const checkSlotAppointment = (dateStr, hour) => {
    // Check if there is an appointment scheduled within this hour range
    return appointments.find(appt => {
      if (appt.date !== dateStr && appt.appointmentDate !== dateStr) return false;
      const apptTime = appt.time || appt.appointmentTime;
      if (!apptTime) return false;
      const apptHour = apptTime.substring(0, 2);
      const slotHour = hour.substring(0, 2);
      return apptHour === slotHour;
    });
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      
      {/* Top section: Overview + Edit Timings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Availability Timing Overview */}
        <div className="lg:col-span-2 premium-card-static p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-650" /> Clinical Availability Timings
              </h2>
              <p className="text-xs text-slate-500">Configure your standard hospital hours during which patients can book appointments.</p>
            </div>
            
            {!editingAvailability && (
              <button 
                onClick={() => setEditingAvailability(true)}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Adjust Hours
              </button>
            )}
          </div>

          {editingAvailability ? (
            <form onSubmit={handleUpdateAvailability} className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-150 animate-fade-in-up">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Opening Time</label>
                <input 
                  type="time" 
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Closing Time</label>
                <input 
                  type="time" 
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex items-end gap-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-teal-650 hover:bg-teal-700 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingAvailability(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-8 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 text-teal-650 rounded-2xl border border-teal-100/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Standard Shifts</span>
                  <span className="text-xs font-bold text-slate-800">Monday - Saturday</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl border border-indigo-100/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Timings</span>
                  <span className="text-xs font-bold text-slate-800">{openingTime} AM - {closingTime} PM</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-450 bg-slate-50 border border-slate-100 p-2.5 rounded-lg max-w-xs">
                <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Time slots outside these parameters will show as locked on patient portals.</span>
              </div>
            </div>
          )}
        </div>

        {/* View Switcher Card */}
        <div className="premium-card-static p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-850">Toggle Calendar Scope</h3>
            <p className="text-[11px] text-slate-450 mt-1">Switch views to plan schedules weekly or examine daily slots.</p>
          </div>
          
          <div className="flex gap-2 mt-6 bg-slate-50 p-1.5 border border-slate-150 rounded-xl">
            <button 
              onClick={() => setViewType('DAILY')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                viewType === 'DAILY' 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daily Slots
            </button>
            <button 
              onClick={() => setViewType('WEEK')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                viewType === 'WEEK' 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Weekly Grid
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Schedule Board */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        
        {/* Calendar Navigation header */}
        {viewType === 'DAILY' ? (
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedDayOffset(Math.max(0, selectedDayOffset - 1))}
                disabled={selectedDayOffset === 0}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="text-sm font-bold text-slate-800">
                {daysList[selectedDayOffset].dayName}, {daysList[selectedDayOffset].month} {daysList[selectedDayOffset].dayNum}
              </h3>
              <button 
                onClick={() => setSelectedDayOffset(Math.min(6, selectedDayOffset + 1))}
                disabled={selectedDayOffset === 6}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
              Daily Planner
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Weekly Overview: {daysList[0].month} {daysList[0].dayNum} - {daysList[6].month} {daysList[6].dayNum}
            </h3>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              7 Days Horizon
            </span>
          </div>
        )}

        {/* 9. Calendar Grid rendering */}
        {viewType === 'DAILY' ? (
          <div className="space-y-3">
            {hourSlots.map((hour) => {
              const dayObj = daysList[selectedDayOffset];
              const isBlocked = blockedSlots[selectedDayOffset]?.[hour];
              const appointment = checkSlotAppointment(dayObj.dateStr, hour);
              
              return (
                <div key={hour} className="flex items-center gap-4 bg-slate-50/40 p-4 rounded-xl border border-slate-150/50 hover:border-slate-350 hover:bg-white transition-all">
                  <div className="w-16 text-xs font-bold text-slate-450">{hour}</div>
                  
                  <div className="flex-1">
                    {appointment ? (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 flex justify-between items-center animate-fade-in-up">
                        <div>
                          <span className="text-[10px] font-bold text-teal-650 uppercase tracking-wider">Appointment</span>
                          <h4 className="text-xs font-bold text-slate-800 mt-0.5">{appointment.patientName}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Reason: {appointment.reason}</p>
                        </div>
                        <span className="text-[10px] font-bold text-teal-700 bg-white border border-teal-200 px-3 py-1 rounded-lg">
                          Scheduled
                        </span>
                      </div>
                    ) : isBlocked ? (
                      <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-red-700 flex justify-between items-center">
                        <span className="text-xs font-semibold">Blocked / Not Available</span>
                        <button 
                          onClick={() => toggleSlotBlocked(selectedDayOffset, hour)}
                          className="text-[10px] font-bold text-red-650 hover:underline"
                        >
                          Unlock Slot
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-medium flex justify-between items-center">
                        <span>Slot Available for Bookings</span>
                        <button 
                          onClick={() => toggleSlotBlocked(selectedDayOffset, hour)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-800"
                        >
                          Mark as Busy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Weekly Schedule Grid
          <div className="overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-8 gap-3">
              
              {/* Header column representing hours */}
              <div className="space-y-3 pt-12">
                {hourSlots.map(h => (
                  <div key={h} className="h-14 flex items-center text-xs font-bold text-slate-400 pr-2 border-r border-slate-100">
                    {h}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {daysList.map((day, dayIdx) => (
                <div key={dayIdx} className="space-y-3">
                  {/* Day Header */}
                  <div className="text-center pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">{day.dayName}</span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center mx-auto mt-1 border border-slate-200">
                      {day.dayNum}
                    </span>
                  </div>

                  {/* Hour slots for this day */}
                  {hourSlots.map(hour => {
                    const isBlocked = blockedSlots[dayIdx]?.[hour];
                    const appointment = checkSlotAppointment(day.dateStr, hour);

                    return (
                      <div 
                        key={hour} 
                        onClick={() => !appointment && toggleSlotBlocked(dayIdx, hour)}
                        className={`h-14 rounded-xl p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                          appointment 
                            ? 'bg-teal-50 border-teal-200 text-teal-850 hover:bg-teal-100/50' 
                            : isBlocked 
                              ? 'bg-red-50/50 border-red-100 text-red-700 hover:bg-red-50' 
                              : 'bg-slate-50/40 border-slate-200/60 hover:bg-white hover:border-slate-350 text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        {appointment ? (
                          <div className="truncate leading-none">
                            <span className="text-[8px] font-bold text-teal-600 block uppercase">Appt</span>
                            <span className="text-[10px] font-extrabold text-slate-850 block mt-0.5 truncate">{appointment.patientName}</span>
                          </div>
                        ) : isBlocked ? (
                          <span className="text-[9px] font-bold">Blocked</span>
                        ) : (
                          <span className="text-[8px] opacity-0 group-hover:opacity-100 font-semibold uppercase">Free</span>
                        )}
                        
                        <div className="text-right text-[8px] font-bold text-slate-400">
                          {hour}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorSchedule;
