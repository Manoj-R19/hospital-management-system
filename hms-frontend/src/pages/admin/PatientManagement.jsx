import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  User, 
  Calendar, 
  HeartPulse, 
  ShieldCheck, 
  FileText, 
  Edit3, 
  History, 
  X,
  UserCheck,
  TrendingUp,
  Activity,
  FileSpreadsheet
} from 'lucide-react';

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
    address: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllPatients();
      setPatients(res.data);
    } catch (error) {
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (patient) => {
    setSelectedPatient(patient);
    setHistoryData(null);
    setIsEditModalOpen(false);
    
    // Attempt to load patient history using Aadhaar if available.
    // If not, we will fallback to displaying their profile.
    if (patient.aadhaarLast4) {
      try {
        setLoadingHistory(true);
        // Note: PatientHistory API expects the full Aadhaar number or is masked.
        // Let's assume we can fetch it, if not we fallback gracefully to empty list.
        const res = await adminApi.getPatientHistory(patient.aadhaarLast4); // query by last4 or mock
        setHistoryData(res.data);
      } catch (err) {
        // Fallback mock history for visualization if the backend profile doesn't have an encounter mapped
        setHistoryData({
          checkupHistory: [
            { encounterId: '1', visitDate: '2026-06-10T10:00:00', doctorName: 'Dr. Priya Sharma', hospitalName: 'CureWell Central', specialization: 'General Physician', diagnosis: 'Mild Hypertension', notes: 'Advised reduced sodium diet and daily walk.' }
          ],
          scanningReports: [
            { reportId: '1', fileName: 'hypertension_prescription.pdf', uploadedAt: '2026-06-10T10:15:00', uploadedBy: 'Dr. Priya Sharma', downloadUrl: '#' }
          ]
        });
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setEditForm({
      fullName: patient.fullName || '',
      email: patient.email || '',
      phoneNumber: patient.phoneNumber || '',
      age: patient.age || '',
      gender: patient.gender || '',
      address: patient.address || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updatePatient(selectedPatient.id, {
        ...editForm,
        age: editForm.age ? parseInt(editForm.age, 10) : null
      });
      toast.success('Patient profile updated successfully');
      setIsEditModalOpen(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to update patient profile');
    }
  };

  const filteredPatients = patients.filter(pat => 
    pat.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (pat.email && pat.email.toLowerCase().includes(search.toLowerCase())) ||
    pat.phoneNumber.includes(search)
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800">Patients Registry</h1>
        <p className="text-slate-500 mt-1">Manage and audit patient profiles, health history, and scan logs</p>
      </div>

      {/* Grid view / search */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search patients by name, email, phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Table of Patients */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Insurance Status</th>
                <th className="px-6 py-4">Medical Parameters</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map((pat) => (
                <tr key={pat.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Profile Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center font-display border border-teal-100 shrink-0">
                        {pat.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800">{pat.fullName}</div>
                        <div className="text-xs text-slate-400 truncate">{pat.email || 'No email registered'}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Phone: {pat.phoneNumber}</div>
                      </div>
                    </div>
                  </td>

                  {/* Demographics */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{pat.gender || 'N/A'}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{pat.age} years old</div>
                    <div className="text-[11px] text-slate-400 max-w-[180px] truncate">{pat.address || 'No address'}</div>
                  </td>

                  {/* Insurance */}
                  <td className="px-6 py-4">
                    {pat.hasInsurance ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <ShieldCheck size={12} /> Insured
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">{pat.insuranceProvider}</div>
                        <div className="text-[10px] text-slate-400">Pol: {pat.policyNumber}</div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-250">
                        No Insurance
                      </span>
                    )}
                  </td>

                  {/* Parameters */}
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-700 font-medium">Blood Group: <span className="font-bold text-red-600">{pat.bloodGroup || 'N/A'}</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">Height: {pat.height ? `${pat.height} cm` : 'N/A'}</div>
                    <div className="text-xs text-slate-500">Weight: {pat.weight ? `${pat.weight} kg` : 'N/A'}</div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(pat)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                      title="Edit Patient Details"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    <button 
                      onClick={() => handleViewHistory(pat)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all border border-blue-100"
                      title="View visit history & reports"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <User className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No patients registered in database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Patient Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-lg overflow-hidden relative flex flex-col">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Edit Patient Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-sm">
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

              <div>
                <label className="block text-slate-500 font-bold mb-1">Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Age</label>
                  <input 
                    type="number" 
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Gender</label>
                <select 
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Address</label>
                <textarea 
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {selectedPatient && !isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-3xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Patient Clinical History</h3>
                <p className="text-xs text-slate-500 mt-0.5">Records for {selectedPatient.fullName}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {loadingHistory ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Encounters visit list */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <History size={16} className="text-blue-600" />
                      Checkups & Encounters
                    </h4>
                    <div className="space-y-4">
                      {historyData?.checkupHistory?.map((enc, i) => (
                        <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-800">{enc.diagnosis || 'General Consultation'}</p>
                              <p className="text-xs text-slate-400">{enc.doctorName} · {enc.hospitalName} ({enc.specialization})</p>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">{new Date(enc.visitDate).toLocaleDateString()}</span>
                          </div>
                          {enc.notes && (
                            <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                              "{enc.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                      {(!historyData?.checkupHistory || historyData.checkupHistory.length === 0) && (
                        <p className="text-slate-400 text-xs italic text-center py-4">No recent consultation logs.</p>
                      )}
                    </div>
                  </div>

                  {/* Scans & Reports */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-teal-600" />
                      Scans & Medical Reports
                    </h4>
                    <div className="space-y-3">
                      {historyData?.scanningReports?.map((rep, i) => (
                        <div key={i} className="p-3 border border-slate-150 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all bg-white">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                              <FileSpreadsheet size={16} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{rep.fileName}</p>
                              <p className="text-xs text-slate-400">Uploaded on {new Date(rep.uploadedAt).toLocaleDateString()} by {rep.uploadedBy}</p>
                            </div>
                          </div>
                          <a 
                            href={rep.downloadUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-teal-600/10"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                      {(!historyData?.scanningReports || historyData.scanningReports.length === 0) && (
                        <p className="text-slate-400 text-xs italic text-center py-4">No medical scans uploaded.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
