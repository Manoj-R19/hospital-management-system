import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { 
  Users, Search, User, Phone, Droplet, ArrowUpRight, 
  Stethoscope, ShieldAlert, HeartPulse, Clock, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [genderFilter, setGenderFilter] = useState('ALL');

  const mockPatients = [
    { id: 'p1', fullName: 'Vikram Singh', age: 41, gender: 'Male', bloodGroup: 'O-', phoneNumber: '8877665544', aadhaar: '888899990000', email: 'vikram.singh@gmail.com', existingConditions: 'Hypertension', address: 'Flat 402, Sector 15, Dwarka, Delhi' },
    { id: 'p2', fullName: 'Rohan Mehta', age: 34, gender: 'Male', bloodGroup: 'B+', phoneNumber: '9876543210', aadhaar: '123456789012', email: 'rohan.mehta@yahoo.com', existingConditions: 'Mild Asthma', address: 'Apt 12B, Hiranandani, Powai, Mumbai' },
    { id: 'p3', fullName: 'Amit Patel', age: 52, gender: 'Male', bloodGroup: 'A-', phoneNumber: '9081726354', aadhaar: '987654321098', email: 'amit.patel@rediffmail.com', existingConditions: 'Type-2 Diabetes', address: '34, Shanti Nagar, Ahmedabad, Gujarat' },
    { id: 'p4', fullName: 'Priya Sharma', age: 28, gender: 'Female', bloodGroup: 'O+', phoneNumber: '9123456789', aadhaar: '111122223333', email: 'priya.sharma@outlook.com', existingConditions: 'Migraines', address: 'C-98, Lajpat Nagar, New Delhi' },
    { id: 'p5', fullName: 'Sneha Reddy', age: 31, gender: 'Female', bloodGroup: 'A+', phoneNumber: '9345678901', aadhaar: '555566667777', email: 'sneha.reddy@gmail.com', existingConditions: 'Acid Reflux', address: 'Block D, Jubilee Hills, Hyderabad' },
    { id: 'p6', fullName: 'Rajesh Nair', age: 60, gender: 'Male', bloodGroup: 'AB+', phoneNumber: '9456789012', aadhaar: '777788889999', email: 'rajesh.nair@gmail.com', existingConditions: 'Mild Osteoarthritis', address: 'Vrindavan Colony, Kochi, Kerala' }
  ];

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/patients');
      if (res.data && res.data.length > 0) {
        setPatients(res.data);
      } else {
        setPatients(mockPatients);
      }
    } catch (error) {
      console.warn('API error fetching patients. Loading mock dataset.', error);
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Update search from URL query param when it changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const filtered = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      p.fullName.toLowerCase().includes(term) || 
      p.aadhaar.includes(term) ||
      (p.phoneNumber && p.phoneNumber.includes(term));
      
    const matchesGender = genderFilter === 'ALL' || p.gender?.toUpperCase() === genderFilter;
    
    return matchesSearch && matchesGender;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-650" /> Patient Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Lookup patient electronic medical records, view diagnostic histories, or start new clinical consultations.</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient name, Aadhaar or phone number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-medium text-slate-800"
          />
        </div>

        {/* Gender Filter */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-medium"
          >
            <option value="ALL">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {/* Total counts */}
        <div className="flex items-center justify-end px-2 text-xs font-bold text-slate-500">
          Total Directory Size: {filtered.length} Patients
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <ShieldAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Patient Records Found</h3>
          <p className="text-xs text-slate-400 mt-1">Verify search queries or add a new patient via the Admin portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((patient) => (
            <div 
              key={patient.id} 
              className="premium-card p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between group shadow-sm hover:border-teal-300"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm shadow-inner border border-teal-100/50">
                      {patient.fullName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{patient.fullName}</h3>
                      <p className="text-[10px] text-slate-450 mt-0.5">{patient.age} Yrs • {patient.gender}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/doctor/patient/${patient.aadhaar}`)}
                    className="p-1.5 bg-slate-50 text-slate-500 hover:text-teal-600 rounded-lg border border-slate-200 transition-colors hover:bg-teal-50"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 border border-slate-200/50 p-3 rounded-xl mt-4">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Droplet className="w-3.5 h-3.5 text-red-500" />
                    <span>Blood: <strong className="text-slate-800 font-bold">{patient.bloodGroup || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{patient.phoneNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Aadhaar Number</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{patient.aadhaar}</span>
                  </div>
                  {patient.existingConditions && (
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Conditions / Comorbidities</span>
                      <span className="inline-flex mt-1 bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded border border-red-100 text-[9px] tracking-wide">
                        {patient.existingConditions}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => navigate(`/doctor/patient/${patient.aadhaar}`)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3" /> EMR History
                </button>
                <button 
                  onClick={() => navigate(`/doctor/patient/${patient.aadhaar}/encounter/new`)}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  <Stethoscope className="w-3 h-3" /> Start Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
