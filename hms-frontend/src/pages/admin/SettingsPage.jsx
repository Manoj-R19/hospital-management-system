import { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Calendar, 
  User, 
  Sliders, 
  Check, 
  Lock, 
  Bell, 
  ShieldCheck 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [workingHours, setWorkingHours] = useState({
    opening: '08:00',
    closing: '22:00',
    emergency: '24/7'
  });

  const [holidays, setHolidays] = useState([
    { name: 'Independence Day', date: '2026-08-15' },
    { name: 'Christmas Day', date: '2026-12-25' }
  ]);

  const [sysConfig, setSysConfig] = useState({
    enableReminders: true,
    reminderInterval: '60', // minutes
    jwtTimeout: '24', // hours
    maintenanceAlerts: true
  });

  const [adminProfile, setAdminProfile] = useState({
    name: 'System Admin',
    email: 'admin@hospital.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleWorkingHoursSubmit = (e) => {
    e.preventDefault();
    toast.success('Hospital operating hours updated');
  };

  const handleSysConfigSubmit = (e) => {
    e.preventDefault();
    toast.success('System configuration parameters saved');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Admin security credentials updated successfully');
    setAdminProfile({ ...adminProfile, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8 text-sm">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800">System Configuration</h1>
        <p className="text-slate-500 mt-1">Manage global operations, holiday calendars, security profiles, and system variables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Hours & Calendar */}
        <div className="space-y-8">
          {/* Operating Hours */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Standard Working Hours
            </h3>
            <form onSubmit={handleWorkingHoursSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Clinic Opening Time</label>
                  <input 
                    type="time" 
                    value={workingHours.opening}
                    onChange={(e) => setWorkingHours({ ...workingHours, opening: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Clinic Closing Time</label>
                  <input 
                    type="time" 
                    value={workingHours.closing}
                    onChange={(e) => setWorkingHours({ ...workingHours, closing: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md shadow-blue-600/10">
                Update Hours
              </button>
            </form>
          </div>

          {/* Holiday Schedule */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              National Holiday Operational Calendar
            </h3>
            <div className="space-y-3">
              {holidays.map((h, idx) => (
                <div key={idx} className="p-3 border border-slate-150 rounded-xl flex items-center justify-between bg-slate-50/50">
                  <div>
                    <p className="font-bold text-slate-800">{h.name}</p>
                    <p className="text-xs text-slate-400">Scheduled: {h.date}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100">Emergency Ops Only</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Profile Security & Sys parameters */}
        <div className="space-y-8">
          {/* Admin Profile Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock size={18} className="text-blue-600" />
              Administrator Profile & Security
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Admin Account Name</label>
                <input 
                  type="text" 
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Official Email</label>
                <input 
                  type="email" 
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={adminProfile.newPassword}
                    onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={adminProfile.confirmPassword}
                    onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md shadow-blue-600/10">
                Update Profile
              </button>
            </form>
          </div>

          {/* System Parameters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sliders size={18} className="text-blue-600" />
              System Parameters Configuration
            </h3>
            <form onSubmit={handleSysConfigSubmit} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={sysConfig.enableReminders}
                    onChange={(e) => setSysConfig({ ...sysConfig, enableReminders: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Enable Medicine Reminders</span>
                    <span className="text-xs text-slate-400">Allow patients to receive email/sms alert notifications</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={sysConfig.maintenanceAlerts}
                    onChange={(e) => setSysConfig({ ...sysConfig, maintenanceAlerts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Console System Notices</span>
                    <span className="text-xs text-slate-400">Expose global notice boards for hospital operational updates</span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Session Expire Timeout (hrs)</label>
                  <input 
                    type="number"
                    value={sysConfig.jwtTimeout}
                    onChange={(e) => setSysConfig({ ...sysConfig, jwtTimeout: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Reminder Polling Rate (secs)</label>
                  <input 
                    type="number"
                    value={sysConfig.reminderInterval}
                    onChange={(e) => setSysConfig({ ...sysConfig, reminderInterval: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md shadow-blue-600/10">
                Save Parameters
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
