import { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  UserPlus, 
  Megaphone, 
  CheckCircle, 
  X,
  Trash2,
  Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'APPOINTMENT', title: 'Appointment Rescheduled', message: 'Julian Vance rescheduled checkup to June 20 at 10:00 AM.', date: 'Today, 10:15 AM', read: false },
  { id: '2', type: 'REGISTRATION', title: 'New Doctor Application', message: 'Dr. Suresh Kumar submitted verification documents for Cardiology.', date: 'Today, 9:30 AM', read: false },
  { id: '3', type: 'WARNING', title: 'Server Maintenance Notice', message: 'System updates will occur tomorrow from 02:00 AM to 04:00 AM.', date: 'Yesterday', read: true },
  { id: '4', type: 'ANNOUNCEMENT', title: 'Holiday Operations Policy', message: 'CureWell will run emergency services only during the upcoming national holiday.', date: '2 days ago', read: true }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Alert marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification cleared');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'REGISTRATION': return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'ANNOUNCEMENT': return <Megaphone className="w-5 h-5 text-emerald-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'APPOINTMENT': return 'bg-indigo-50 border-indigo-100';
      case 'REGISTRATION': return 'bg-blue-50 border-blue-100';
      case 'WARNING': return 'bg-amber-50 border-amber-100';
      case 'ANNOUNCEMENT': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-slate-50 border-slate-150';
    }
  };

  return (
    <div className="space-y-8 text-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Alerts & Notifications</h1>
          <p className="text-slate-500 mt-1">Review operational updates, warnings, and global notice boards</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 hover:text-red-500 rounded-xl hover:bg-slate-50 font-bold transition-all"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 max-w-4xl">
        {notifications.map(n => (
          <div key={n.id} className={`p-5 flex items-start gap-4 hover:bg-slate-55/30 transition-all border-l-4 ${n.read ? 'border-l-transparent opacity-70' : 'border-l-blue-600'}`}>
            <div className={`p-3 rounded-xl border shrink-0 ${getBg(n.type)}`}>
              {getIcon(n.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {n.title}
                    {!n.read && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{n.date}</p>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {!n.read && (
                    <button 
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1 hover:bg-slate-100 text-blue-600 rounded-lg hover:text-blue-800"
                      title="Mark as Read"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(n.id)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg"
                    title="Clear notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 mt-2 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <Bell size={40} className="text-slate-200 mb-3" />
            <p className="font-bold text-slate-700">No new alerts.</p>
            <p className="text-xs text-slate-400 mt-0.5">We will notify you when system events occur.</p>
          </div>
        )}
      </div>
    </div>
  );
}
