import { useState } from 'react';
import { 
  Shield, 
  User, 
  Users, 
  Lock, 
  Key, 
  Check, 
  AlertCircle,
  Plus,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MOCK_USERS = [
  { id: '1', name: 'System Admin', email: 'admin@hospital.com', role: 'ADMIN', status: 'ACTIVE' },
  { id: '2', name: 'Dr. Priya Sharma', email: 'dr.priya@hospital.com', role: 'DOCTOR', status: 'ACTIVE' },
  { id: '3', name: 'Sanjay Dutt', email: 'sanjay.reception@hospital.com', role: 'RECEPTIONIST', status: 'ACTIVE' },
  { id: '4', name: 'Reena Sen', email: 'reena.nurse@hospital.com', role: 'STAFF', status: 'ACTIVE' }
];

const MOCK_PERMISSIONS = [
  { resource: 'Patient Records', ADMIN: ['Read', 'Write', 'Edit', 'Delete'], DOCTOR: ['Read', 'Write', 'Edit'], RECEPTIONIST: ['Read', 'Write'], STAFF: ['Read'] },
  { resource: 'Doctor Directories', ADMIN: ['Read', 'Write', 'Edit', 'Delete'], DOCTOR: ['Read'], RECEPTIONIST: ['Read'], STAFF: ['Read'] },
  { resource: 'Appointments Desk', ADMIN: ['Read', 'Write', 'Edit', 'Delete'], DOCTOR: ['Read', 'Write'], RECEPTIONIST: ['Read', 'Write', 'Edit'], STAFF: ['Read'] },
  { resource: 'Billing & Invoices', ADMIN: ['Read', 'Write', 'Edit', 'Delete'], DOCTOR: [], RECEPTIONIST: ['Read', 'Write'], STAFF: [] }
];

export default function RolesPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [permissions, setPermissions] = useState(MOCK_PERMISSIONS);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'STAFF' });

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success(`User access role updated to ${newRole}`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = (users.length + 1).toString();
    setUsers([...users, { id, ...newUser, status: 'ACTIVE' }]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'STAFF' });
    toast.success('System console user registered successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Console Security & Roles</h1>
          <p className="text-slate-500 mt-1">Audit user access lists, security roles, and system permission matrix</p>
        </div>
        <button 
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          <Plus size={16} /> Register Console User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
        {/* Left: Console Users List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                Console Access Members
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 text-blue-700 font-bold rounded-lg flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold text-slate-700"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="DOCTOR">DOCTOR</option>
                          <option value="RECEPTIONIST">RECEPTIONIST</option>
                          <option value="STAFF">STAFF</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {u.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toast.error('Standard profiles cannot be deleted')}
                          className="text-xs text-slate-400 hover:text-red-500 font-bold"
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Security Matrix Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-blue-600" />
            Roles & Permissions Matrix
          </h3>

          <div className="space-y-4 flex-1">
            {permissions.map((p, i) => (
              <div key={i} className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 space-y-2">
                <p className="font-bold text-slate-800 text-xs">{p.resource}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                  <div>
                    <span className="font-bold text-slate-600 block">ADMIN:</span>
                    {p.ADMIN.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">DOCTOR:</span>
                    {p.DOCTOR.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">RECEPTIONIST:</span>
                    {p.RECEPTIONIST.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">STAFF:</span>
                    {p.STAFF.join(', ') || 'None'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddUserOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-sm overflow-hidden relative">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Add Console User</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="STAFF">STAFF</option>
                  <option value="RECEPTIONIST">RECEPTIONIST</option>
                  <option value="DOCTOR">DOCTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-4 py-1.5 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
