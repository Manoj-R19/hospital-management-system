import { useEffect, useState } from 'react';
import { bloodBankApi } from '../../api/bloodBankApi';
import { adminApi } from '../../api/adminApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Plus, 
  Send, 
  X, 
  Check, 
  AlertCircle,
  Clock,
  ExternalLink,
  Navigation
} from 'lucide-react';

export default function EmergencyRequestPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    bloodGroup: 'O-',
    unitsRequired: 1.0,
    urgencyLevel: 'HIGH',
    hospitalName: 'CureWell General Hospital',
    hospitalAddress: 'S.V. Road, Andheri West, Mumbai',
    hospitalLatitude: '19.1197',
    hospitalLongitude: '72.8468',
    patientId: '',
    notes: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [reqsRes, patsRes] = await Promise.all([
        bloodBankApi.getAllRequests(),
        adminApi.getAllPatients()
      ]);
      setRequests(reqsRes.data.reverse());
      setPatients(patsRes.data);
    } catch (err) {
      toast.error('Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRequest = async (req) => {
    setSelectedRequest(req);
    setMatches([]);
    try {
      setLoadingMatches(true);
      const res = await bloodBankApi.getMatches(req.id);
      setMatches(res.data);
    } catch (err) {
      toast.error('Failed to load donor matches');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        requesterId: user.id,
        unitsRequired: parseFloat(form.unitsRequired),
        hospitalLatitude: parseFloat(form.hospitalLatitude),
        hospitalLongitude: parseFloat(form.hospitalLongitude)
      };
      const res = await bloodBankApi.createRequest(payload);
      toast.success('Emergency blood request created successfully');
      setIsCreateModalOpen(false);
      
      // Auto select the new request to show matches
      fetchInitialData();
      handleSelectRequest(res.data);
    } catch (err) {
      toast.error('Failed to submit request');
    }
  };

  const handleSendAlerts = async (requestId) => {
    try {
      await bloodBankApi.notifyDonors(requestId);
      toast.success('SMS and app notification alerts dispatched to matching donors');
      
      // Reload matches to show notified states
      const req = requests.find(r => r.id === requestId);
      if (req) {
        req.status = 'MATCHING';
        handleSelectRequest(req);
      }
      fetchInitialData();
    } catch (err) {
      toast.error('Failed to dispatch notification alerts');
    }
  };

  const handleUpdateMatchStatus = async (matchId, status) => {
    try {
      await bloodBankApi.updateMatchStatus(matchId, status);
      toast.success(`Donor response recorded as: ${status}`);
      if (selectedRequest) {
        handleSelectRequest(selectedRequest);
      }
      fetchInitialData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Emergency Requests Directory</h1>
          <p className="text-slate-500 mt-1">Initiate and monitor high-urgency blood drives and match notifications</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-650 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-600/10"
        >
          <Plus size={16} /> Create Emergency Request
        </button>
      </div>

      {/* Main Split Screen Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Requests List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col max-h-[80vh] overflow-y-auto space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b pb-3 border-slate-100 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" /> Active Drives ({requests.length})
          </h3>
          
          <div className="space-y-3">
            {requests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div 
                  key={req.id}
                  onClick={() => handleSelectRequest(req)}
                  className={`p-4 border rounded-xl cursor-pointer hover:shadow-md transition-all flex flex-col gap-2.5
                    ${isSelected 
                      ? 'border-red-400 bg-red-50/20 shadow-sm' 
                      : 'border-slate-200 bg-slate-50/30'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded-lg font-bold font-display text-xs">
                      {req.bloodGroup}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold
                      ${req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : ''}
                      ${req.status === 'MATCHING' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {req.status}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 truncate">{req.hospitalName}</h5>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{req.unitsRequired} units · {req.urgencyLevel} Urgency</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 border-t pt-2 border-slate-100">
                    <span>Patient ID: {req.patient?.fullName || 'Anonymous'}</span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
            {requests.length === 0 && (
              <p className="text-center py-10 text-slate-400 text-xs italic">No blood drives configured.</p>
            )}
          </div>
        </div>

        {/* Right Side: Matches Dashboard */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[50vh]">
          {selectedRequest ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Selected Request Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600 text-white font-extrabold font-display rounded-lg text-sm">{selectedRequest.bloodGroup}</span>
                    <h4 className="font-bold text-slate-800">{selectedRequest.hospitalName}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={12} /> {selectedRequest.hospitalAddress}</p>
                  {selectedRequest.notes && <p className="text-xs text-slate-400 italic mt-2">Notes: "{selectedRequest.notes}"</p>}
                </div>
                
                <div className="flex flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold">Volume Required</p>
                    <p className="text-lg font-bold text-slate-700">{selectedRequest.unitsRequired} Units</p>
                  </div>
                  
                  {selectedRequest.status === 'PENDING' && (
                    <button 
                      onClick={() => handleSendAlerts(selectedRequest.id)}
                      className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-rose-650 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      <Send size={12} /> Dispatch SMS Alerts
                    </button>
                  )}
                  {selectedRequest.status === 'MATCHING' && (
                    <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-200 animate-pulse">
                      Alerts Sent · Waiting Responses
                    </span>
                  )}
                  {selectedRequest.status === 'FULFILLED' && (
                    <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                      Request Fulfilled
                    </span>
                  )}
                </div>
              </div>

              {/* Match List */}
              <div className="flex-1 flex flex-col min-h-[300px]">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Droplet size={16} className="text-red-500" /> Compatible Donors Nearby
                </h4>
                
                {loadingMatches ? (
                  <div className="flex justify-center items-center py-20 flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 flex-1">
                    {matches.map((match) => (
                      <div key={match.id} className="p-4 border border-slate-150 rounded-xl hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4 bg-slate-50/20">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-red-50 text-red-700 font-bold flex items-center justify-center font-display border border-red-100 shrink-0 text-sm">
                              {match.bloodGroup}
                            </span>
                            <div>
                              <h5 className="font-bold text-slate-800">{match.fullName}</h5>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Navigation size={12} /> {match.distanceKm} km away · {match.address}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1"><Phone size={12} /> {match.phoneNumber}</span>
                            <span className="flex items-center gap-1">Status: <span className="font-bold text-slate-700">{match.notificationStatus}</span></span>
                          </div>
                        </div>

                        {/* Actions to accept/decline responses */}
                        <div className="flex items-center gap-2">
                          {match.notificationStatus === 'PENDING' && (
                            <span className="text-xs text-slate-400 italic">Alerts not sent</span>
                          )}
                          {match.notificationStatus === 'NOTIFIED' && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleUpdateMatchStatus(match.id, 'ACCEPTED')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateMatchStatus(match.id, 'DECLINED')}
                                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          {match.notificationStatus === 'ACCEPTED' && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md">
                                <Check size={12} /> Accepted
                              </span>
                              <button 
                                onClick={() => handleUpdateMatchStatus(match.id, 'COMPLETED')}
                                className="px-3 py-1 bg-blue-650 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                              >
                                Confirm Donation
                              </button>
                            </div>
                          )}
                          {match.notificationStatus === 'COMPLETED' && (
                            <span className="text-xs text-blue-600 font-bold flex items-center gap-0.5 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-md">
                              <Check size={12} /> Donation Completed
                            </span>
                          )}
                          {match.notificationStatus === 'DECLINED' && (
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-0.5 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                              <X size={12} /> Declined
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {matches.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <AlertCircle size={24} className="mb-2" />
                        <p className="text-xs italic">No matched compatible donors registered within threshold distance.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 flex-1">
              <AlertCircle size={36} className="text-slate-300 mb-3" />
              <h4 className="font-semibold text-slate-700">No Request Selected</h4>
              <p className="text-xs text-slate-400 mt-1">Select an active blood drive on the left to see matches and notify donors.</p>
            </div>
          )}
        </div>

      </div>

      {/* Create Emergency Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Create Urgent Blood Drive</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Blood Group Needed</label>
                  <select 
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  >
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Units Required (Bags)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    min="0.5"
                    value={form.unitsRequired}
                    onChange={(e) => setForm({ ...form, unitsRequired: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Urgency Level</label>
                  <select 
                    value={form.urgencyLevel}
                    onChange={(e) => setForm({ ...form, urgencyLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Link Patient Account (Optional)</label>
                  <select 
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="">Select Admitted Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName} ({p.bloodGroup || 'No Blood Group'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Destination Hospital / Clinic</label>
                <input 
                  type="text" 
                  value={form.hospitalName}
                  onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Hospital Location Address</label>
                <textarea 
                  value={form.hospitalAddress}
                  onChange={(e) => setForm({ ...form, hospitalAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none h-16 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Latitude (GPS)</label>
                  <input 
                    type="text" 
                    value={form.hospitalLatitude}
                    onChange={(e) => setForm({ ...form, hospitalLatitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Longitude (GPS)</label>
                  <input 
                    type="text" 
                    value={form.hospitalLongitude}
                    onChange={(e) => setForm({ ...form, hospitalLongitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Internal Notes</label>
                <textarea 
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="E.g. patient undergoes surgery tomorrow morning, double bags requested."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none h-16 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md shadow-red-600/10">
                  Initiate Drive & Matches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
