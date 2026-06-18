import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  UserMinus, 
  Ban, 
  Check, 
  Edit3, 
  Clock, 
  MapPin, 
  GraduationCap,
  Plus,
  X,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    qualification: '',
    specialization: '',
    hospitalName: '',
    hospitalAddress: '',
    hospitalOpeningTime: '',
    hospitalClosingTime: '',
    hospitalFacilities: []
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllDoctors();
      setDoctors(res.data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await adminApi.verifyDoctor(id);
      toast.success('Doctor verified successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  const handleBlacklist = async (id, isUserActive) => {
    try {
      // If user is active (isActive = true), we want to blacklist them (blacklist: true)
      const shouldBlacklist = isUserActive;
      await adminApi.blacklistDoctor(id, shouldBlacklist);
      toast.success(shouldBlacklist ? 'Doctor blacklisted' : 'Doctor unblacklisted');
      fetchDoctors();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await adminApi.removeDoctor(id);
      toast.success('Doctor removed from registry');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to remove doctor');
    }
  };

  const openEditModal = (doc) => {
    setSelectedDoctor(doc);
    setEditForm({
      fullName: doc.fullName || '',
      email: doc.email || '',
      phoneNumber: doc.phoneNumber || '',
      qualification: doc.qualification || '',
      specialization: doc.specialization || '',
      hospitalName: doc.hospitalName || '',
      hospitalAddress: doc.hospitalAddress || '',
      hospitalOpeningTime: doc.hospitalOpeningTime || '',
      hospitalClosingTime: doc.hospitalClosingTime || '',
      hospitalFacilities: doc.hospitalFacilities || []
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateDoctor(selectedDoctor.id, editForm);
      toast.success('Doctor details updated');
      setIsEditModalOpen(false);
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to update doctor details');
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.fullName.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
    doc.hospitalName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Doctors Directory</h1>
          <p className="text-slate-500 mt-1">Manage, verify, and monitor active medical practitioners</p>
        </div>
        <button 
          onClick={() => navigate('/admin/doctors/register')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          <Plus size={16} /> Register Doctor
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
              placeholder="Search by name, specialty, clinic..." 
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
                <th className="px-6 py-4">Doctor Details</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Hospital Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center font-display border border-blue-100 shrink-0">
                        {doc.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800">{doc.fullName}</div>
                        <div className="text-xs text-slate-400 truncate">{doc.email}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Phone: {doc.phoneNumber}</div>
                      </div>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-slate-400" />
                      {doc.specialization}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{doc.qualification}</div>
                  </td>

                  {/* Hospital */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{doc.hospitalName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={12} className="text-slate-400 shrink-0" />
                      {doc.hospitalOpeningTime} - {doc.hospitalClosingTime}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      {doc.isVerified ? (
                        <span className="inline-flex items-center gap-1 w-max px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 w-max px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <ShieldAlert size={13} /> Pending Review
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(doc)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                      title="Edit Doctor Details"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    {!doc.isVerified && (
                      <button 
                        onClick={() => handleVerify(doc.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-emerald-600/10"
                        title="Approve & Verify Credentials"
                      >
                        Verify
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        if (doc.isVerified) {
                          handleBlacklist(doc.id, doc.isActive !== false);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border
                        ${doc.isVerified 
                          ? doc.isActive !== false
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200'}
                      `}
                      disabled={!doc.isVerified}
                      title={doc.isActive !== false ? "Block Doctor" : "Unblock Doctor"}
                    >
                      {doc.isActive !== false ? 'Block' : 'Unblock'}
                    </button>

                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                      title="Delete Doctor"
                    >
                      <UserMinus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No doctors matched your criteria.</p>
                      <p className="text-xs text-slate-400 mt-1">Try refining your search text.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Doctor Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Edit Doctor Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Qualification</label>
                  <input 
                    type="text" 
                    value={editForm.qualification}
                    onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Specialization / Department</label>
                  <select 
                    value={editForm.specialization}
                    onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option>General Physician</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Gynecology</option>
                    <option>Dermatology</option>
                    <option>Dentistry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Opening Time</label>
                  <input 
                    type="time" 
                    value={editForm.hospitalOpeningTime}
                    onChange={(e) => setEditForm({ ...editForm, hospitalOpeningTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Closing Time</label>
                  <input 
                    type="time" 
                    value={editForm.hospitalClosingTime}
                    onChange={(e) => setEditForm({ ...editForm, hospitalClosingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Hospital / Clinic Name</label>
                <input 
                  type="text" 
                  value={editForm.hospitalName}
                  onChange={(e) => setEditForm({ ...editForm, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Hospital Address</label>
                <textarea 
                  value={editForm.hospitalAddress}
                  onChange={(e) => setEditForm({ ...editForm, hospitalAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                  required
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
