import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';

const SearchPatient = () => {
  const [aadhaar, setAadhaar] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (aadhaar.length !== 12) {
      toast.error('Aadhaar must be exactly 12 digits');
      return;
    }
    navigate(`/doctor/patient/${aadhaar}`);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
      <div className="premium-card p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-100 shadow-inner">
          <Search className="w-10 h-10 text-teal-600" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Search Patient</h2>
        <p className="text-slate-500 mb-8">Enter the patient's 12-digit Aadhaar number to access their electronic medical records.</p>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <input 
              type="text" 
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').substring(0, 12))}
              placeholder="0000 0000 0000"
              className="w-full p-4 border border-slate-300 rounded-xl text-2xl tracking-[0.25em] text-center font-mono focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner bg-slate-50"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all text-lg flex justify-center items-center gap-2">
            <Search size={20} /> Locate Records
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchPatient;
