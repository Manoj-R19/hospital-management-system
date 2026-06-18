import { useEffect, useState } from 'react';
import { bloodBankApi } from '../../api/bloodBankApi';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  X, 
  Activity, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function BloodDonorPage() {
  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Register Form State
  const [form, setForm] = useState({
    fullName: '',
    bloodGroup: 'O-',
    phoneNumber: '',
    email: '',
    address: '',
    latitude: '19.0760',
    longitude: '72.8777',
    patientId: '',
    notificationConsent: true
  });

  useEffect(() => {
    fetchDonorsAndPatients();
  }, []);

  const fetchDonorsAndPatients = async () => {
    try {
      setLoading(true);
      const [donorsRes, patsRes] = await Promise.all([
        bloodBankApi.getAllDonors(),
        adminApi.getAllPatients()
      ]);
      setDonors(donorsRes.data);
      setPatients(patsRes.data);
    } catch (err) {
      toast.error('Failed to load donor database');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDonor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      };
      await bloodBankApi.registerDonor(payload);
      toast.success('Volunteer donor registered successfully');
      setIsRegisterModalOpen(false);
      setForm({
        fullName: '',
        bloodGroup: 'O-',
        phoneNumber: '',
        email: '',
        address: '',
        latitude: '19.0760',
        longitude: '72.8777',
        patientId: '',
        notificationConsent: true
      });
      fetchDonorsAndPatients();
    } catch (err) {
      toast.error('Failed to register donor');
    }
  };

  const filteredDonors = donors.filter(d => 
    d.fullName.toLowerCase().includes(search.toLowerCase()) ||
    d.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
    d.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Volunteer Donors Registry</h1>
          <p className="text-slate-500 mt-1">Manage notification consent, address coordinates, and eligibility dates</p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          <Plus size={16} /> Register Volunteer Donor
        </button>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, blood group, locality..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Donor Details</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Locality / Coordinates</th>
                <th className="px-6 py-4">SMS Alerts</th>
                <th className="px-6 py-4">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center font-display border border-blue-100 shrink-0">
                        {donor.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800">{donor.fullName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12} /> {donor.email || 'No email registered'}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone size={12} /> {donor.phoneNumber}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold font-display text-sm">
                      {donor.bloodGroup}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      {donor.address}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">GPS: {donor.latitude}, {donor.longitude}</div>
                  </td>

                  <td className="px-6 py-4">
                    {donor.notificationConsent ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Opted In
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        Opted Out
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {donor.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle size={12} /> Ready to Donate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle size={12} /> Deferred
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No matching donors registered in registry.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Donor Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Register Volunteer Donor</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterDonor} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Blood Group</label>
                  <select 
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Link Patient ID (Optional)</label>
                  <select 
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Existing Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName} ({p.bloodGroup || 'No Blood Group'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Address / Locality</label>
                <textarea 
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-16 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Latitude (GPS)</label>
                  <input 
                    type="text" 
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Longitude (GPS)</label>
                  <input 
                    type="text" 
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="consent"
                  checked={form.notificationConsent}
                  onChange={(e) => setForm({ ...form, notificationConsent: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="font-semibold text-slate-700">Consent to receive emergency blood drive alerts via SMS / Phone calls</label>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Register Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
