import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReminderPoll } from '../../hooks/useReminderPoll';
import ReminderNotification from '../../components/common/ReminderNotification';
import { patientApi } from '../../api/patientApi';
import { 
  LayoutDashboard, Calendar, Pill, FileText, Clock, Bell, HelpCircle, 
  Settings, HeartPulse, LogOut, ChevronDown, Check, Menu, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientLayout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Activate background medicine timing polling hook
  useReminderPoll();

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Take Amoxicillin (500mg) in 15 minutes', unread: true, time: '10m ago' },
    { id: 2, text: 'Lab report "Thyroid Panel" is ready for download', unread: true, time: '1h ago' },
    { id: 3, text: 'Refill alert: Metformin (500mg) running low (3 days left)', unread: false, time: '1d ago' }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login/patient');
  };

  useEffect(() => {
    patientApi.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => {
        // Fallback profile if user session is mock or db details missing
        setProfile({
          fullName: user?.name || 'Rahul Sharma',
          bloodGroup: 'B+',
          phoneNumber: '9876543210'
        });
      });
  }, [user]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Medicines & Reminders', path: '/patient/medicines', icon: Pill },
    { name: 'Reports & Labs', path: '/patient/reports', icon: FileText },
    { name: 'Visit History', path: '/patient/history', icon: Clock },
    { name: 'Notifications', path: '/patient/notifications', icon: Bell },
    { name: 'Support desk', path: '/patient/support', icon: HelpCircle },
    { name: 'Profile Settings', path: '/patient/settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-blue-900/50">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-blue-650" />
          </div>
          <div>
            <span className="text-lg font-display font-extrabold tracking-tight block">My Health Portal</span>
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">CureWell Patients</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/patient/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-700/80 text-white shadow-md font-bold' 
                    : 'text-blue-100 hover:bg-blue-900 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-300' : 'text-blue-305/70'}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Profile Card */}
        <div className="p-4 border-t border-blue-900/50 bg-blue-950/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-blue-900/40 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center font-bold text-sm text-blue-105 shadow-inner">
              {profile?.fullName?.charAt(0) || 'P'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-blue-200 truncate">{profile?.fullName || 'Patient'}</p>
              <p className="text-[10px] text-blue-450 truncate">Blood Group: {profile?.bloodGroup || 'O+'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 w-full justify-center bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 py-2 rounded-xl transition-colors font-medium text-xs border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0 z-15 justify-between relative shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight capitalize">
            {location.pathname.split('/').pop().replace('-', ' ')}
          </h2>

          {/* Right Header Controls */}
          <div className="flex items-center gap-6 relative">
            {/* Clock & Date */}
            <div className="text-[13px] text-slate-500 font-semibold hidden md:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center relative border border-slate-200 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-550 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40 animate-fade-in-up">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-blue-50/20' : ''}`}>
                          <div className="flex items-start gap-2 justify-between">
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.text}</p>
                            {n.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1"></span>}
                          </div>
                          <span className="text-[10px] text-slate-450 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shadow-inner">
                  {profile?.fullName?.charAt(0) || 'P'}
                </div>
                <div className="text-left leading-none hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{profile?.fullName || 'Patient'}</p>
                  <span className="text-[9px] text-slate-500 font-semibold">CureWell Member</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40">
                    <Link 
                      to="/patient/settings" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Settings className="w-4 h-4 text-slate-400" /> Profile Settings
                    </Link>
                    <button 
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-650 hover:bg-red-50 font-medium w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* Outlet Content */}
        <div className="flex-1 p-6 overflow-auto bg-slate-50/50">
          <Outlet />
        </div>
      </main>
      
      {/* Global Notification */}
      <ReminderNotification />
    </div>
  );
};

export default PatientLayout;
