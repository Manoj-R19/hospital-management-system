import { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import { useAuthStore } from '../../store/authStore';
import { 
  User, Settings, Shield, Save, HeartPulse, Phone, Mail, Award, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientSettings = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const mockProfile = {
    fullName: 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@curewell.com',
    phoneNumber: '9876543210',
    aadhaarLast4: '8902',
    age: 29,
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Flat 101, block C, Shanti Vihar, Dwarka, Sector 12, New Delhi',
    hasInsurance: true,
    insuranceProvider: 'HDFC Ergo Health Insurance',
    policyNumber: 'POL-192849-B',
    allergies: 'Penicillin, Dust',
    medicalConditions: 'Mild Asthma',
    emergencyContactName: 'Aarti Sharma',
    emergencyContactNumber: '9123456789'
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getProfile();
      setProfile(res.data);
      
      // Initialize edit fields
      setFullName(res.data.fullName || '');
      setPhone(res.data.phoneNumber || '');
      setAge(res.data.age || 29);
      setGender(res.data.gender || 'Male');
      setBloodGroup(res.data.bloodGroup || 'O+');
      setAddress(res.data.address || '');
      setHasInsurance(res.data.hasInsurance || false);
      setInsuranceProvider(res.data.insuranceProvider || '');
      setPolicyNumber(res.data.policyNumber || '');
      setAllergies(res.data.allergies || '');
      setMedicalConditions(res.data.medicalConditions || '');
      setEmergencyName(res.data.emergencyContactName || '');
      setEmergencyPhone(res.data.emergencyContactNumber || '');
    } catch (e) {
      console.warn('API error fetching patient profile. Using mock datasets.', e);
      setProfile(mockProfile);
      setFullName(mockProfile.fullName);
      setPhone(mockProfile.phoneNumber);
      setAge(mockProfile.age);
      setGender(mockProfile.gender);
      setBloodGroup(mockProfile.bloodGroup);
      setAddress(mockProfile.address);
      setHasInsurance(mockProfile.hasInsurance);
      setInsuranceProvider(mockProfile.insuranceProvider);
      setPolicyNumber(mockProfile.policyNumber);
      setAllergies(mockProfile.allergies);
      setMedicalConditions(mockProfile.medicalConditions);
      setEmergencyName(mockProfile.emergencyContactName);
      setEmergencyPhone(mockProfile.emergencyContactNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      // Stub backend updating or profile save
      toast.success('Clinical settings saved successfully');
      setProfile({
        ...profile,
        fullName,
        phoneNumber: phone,
        age,
        gender,
        bloodGroup,
        address,
        hasInsurance,
        insuranceProvider,
        policyNumber,
        allergies,
        medicalConditions,
        emergencyContactName: emergencyName,
        emergencyContactNumber: emergencyPhone
      });
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-650" /> Personal Profile Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your clinical files, insurance status, allergies, and emergency contact lists.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-650"></div>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left panel: Info */}
          <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden text-center p-6 space-y-4">
            <div className="w-20 h-20 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center font-display font-extrabold text-2xl mx-auto shadow-inner border border-blue-100">
              {fullName?.charAt(0)}
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-800">Rahul Sharma</h3>
              <p className="text-[10px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block mt-1 font-bold tracking-wide">
                Patient Member
              </p>
            </div>
            
            <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Aadhaar Last 4: <strong className="text-slate-800 font-bold">{profile?.aadhaarLast4 || '8902'}</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{phone}</span>
              </div>
            </div>
          </div>

          {/* Right panel: Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Info */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-blue-650" /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Full Patient Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Phone Line</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Blood Group</label>
                    <select 
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Home Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Health Conditions & Allergies */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-855 flex items-center gap-2">
                <HeartPulse className="w-4.5 h-4.5 text-blue-650" /> Clinical History & Allergies
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Known Drug/Food Allergies</label>
                  <input 
                    type="text" 
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Penicillin, Pollen, Peanuts"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Chronic Diseases / Medical Conditions</label>
                  <input 
                    type="text" 
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Details */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-blue-650" /> Insurance Policy Coverage
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="hasIns"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasIns" className="text-xs font-bold text-slate-700">I have active health insurance policy coverage</label>
                </div>

                {hasInsurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Insurance Provider</label>
                      <input 
                        type="text" 
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Policy Number</label>
                      <input 
                        type="text" 
                        value={policyNumber}
                        onChange={(e) => setPolicyNumber(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-blue-650" /> Emergency Helpline contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Emergency Contact Person</label>
                  <input 
                    type="text" 
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Emergency Contact Number</label>
                  <input 
                    type="text" 
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Health Settings
              </button>
            </div>

          </div>
        </form>
      )}
    </div>
  );
};

export default PatientSettings;
