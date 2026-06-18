import { useState } from 'react';
import { 
  Bell, Check, AlertTriangle, Info, Calendar, Pill, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'MEDICINE', title: 'Medication Alert: Amoxicillin', text: 'Take Amoxicillin (500mg) in 15 minutes. Ensure it is taken after food.', unread: true, time: '10m ago' },
    { id: 2, type: 'REPORT', title: 'Lab Results Uploaded', text: 'Diagnostic scanning report "Thyroid Panel (TSH)" is ready for download in your reports vault.', unread: true, time: '1h ago' },
    { id: 3, type: 'REFILL', title: 'Prescription Refill Warning', text: 'Your Montelukast (10mg) prescription has 3 days remaining. Request a refill appointment with Dr. Suresh.', unread: false, time: '1d ago' },
    { id: 4, type: 'APPOINTMENT', title: 'Appointment Booking Confirmed', text: 'Your physical checkup with Dr. Suresh Kumar is approved for today at 6:30 PM. Your Token is #08.', unread: false, time: '1d ago' },
    { id: 5, type: 'EMERGENCY', title: 'Hospital Announcement', text: 'General Medicine OP block has shifted to the new North Wing building, 2nd Floor.', unread: false, time: '3d ago' }
  ]);

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    toast.success('Notification marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification removed');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-650" /> Alerts & Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">Stay updated with medicine refill timings, appointment check-ins, and hospital guidelines.</p>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-2 rounded-xl transition-all"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Inbox Clean</h3>
            <p className="text-xs text-slate-400 mt-1">You have no new alerts or notifications.</p>
          </div>
        ) : (
          notifications.map((n) => {
            return (
              <div 
                key={n.id} 
                className={`p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between gap-4 relative overflow-hidden ${
                  n.unread ? 'border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon depending on type */}
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'MEDICINE' ? 'bg-rose-50 text-rose-605 text-rose-500' :
                    n.type === 'REFILL' ? 'bg-amber-50 text-amber-600' :
                    n.type === 'EMERGENCY' ? 'bg-red-50 text-red-600' :
                    n.type === 'APPOINTMENT' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-blue-50 text-blue-650'
                  }`}>
                    {n.type === 'MEDICINE' || n.type === 'REFILL' ? <Pill size={18} /> :
                     n.type === 'APPOINTMENT' ? <Calendar size={18} /> :
                     n.type === 'EMERGENCY' ? <AlertTriangle size={18} /> :
                     <Info size={18} />}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      {n.title}
                      {n.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>}
                    </h3>
                    <p className="text-xs text-slate-650 font-medium leading-relaxed max-w-xl">{n.text}</p>
                    <span className="text-[9px] text-slate-400 font-semibold block pt-1">{n.time}</span>
                  </div>
                </div>

                <div className="flex gap-1.5 items-start shrink-0">
                  {n.unread && (
                    <button 
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 hover:bg-slate-100 rounded text-blue-600"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default PatientNotifications;
