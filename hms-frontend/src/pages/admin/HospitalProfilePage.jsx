import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  Edit3,
  Map
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HospitalProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'CureWell Multi-Speciality General Hospital',
    speciality: 'Cardiology, Neurology, Orthopedics, Pediatrics & Emergency Trauma Care',
    address: 'Plot No. 12, Medical District Road, Sector 5, New Delhi, 110001, India',
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    phone: '+91 11 4050 9000',
    email: 'contact@curewell.hospital',
    website: 'https://www.curewell.hospital',
    accreditation: 'NABH Accreditated & Joint Commission International (JCI) Certified'
  });

  const [form, setForm] = useState({ ...profile });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...form });
    setIsEditing(false);
    toast.success('Hospital credentials updated successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Hospital Profile</h1>
          <p className="text-slate-500 mt-1">Review and manage corporate hospital profiles, licensing, and contact details</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Hospital Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Clinical Specialities</label>
                <input 
                  type="text" 
                  value={form.speciality}
                  onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Accreditation / Licensing</label>
                <input 
                  type="text" 
                  value={form.accreditation}
                  onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Opening Hour</label>
                  <input 
                    type="text" 
                    value={form.openingTime}
                    onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Closing Hour</label>
                  <input 
                    type="text" 
                    value={form.closingTime}
                    onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Office Telephone</label>
                  <input 
                    type="text" 
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Administrative Email</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Postal Address</label>
                <textarea 
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setForm({ ...profile }); setIsEditing(false); }}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header card info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">{profile.name}</h2>
                  <p className="text-sm text-blue-600 font-semibold mt-0.5">{profile.accreditation}</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Data fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Clinical Focus & Speciality</p>
                      <p className="text-xs text-slate-500 mt-0.5">{profile.speciality}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Physical Address</p>
                      <p className="text-xs text-slate-500 mt-0.5">{profile.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Hours of Operation</p>
                      <p className="text-xs text-slate-500 mt-0.5">{profile.openingTime} - {profile.closingTime} (Daily)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Contact Telephone</p>
                      <p className="text-xs text-slate-500 mt-0.5">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Email Address</p>
                      <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Map & Accreditations */}
        <div className="space-y-6">
          {/* Map simulator */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col h-72">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
              <Map size={16} className="text-blue-600" />
              Hospital Map Coordinates
            </h3>
            {/* Map representation */}
            <div className="bg-slate-100 rounded-xl border border-slate-200 flex-1 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <MapPin size={32} className="text-red-500 mb-2 relative z-10 animate-bounce" />
              <p className="font-bold text-slate-800 text-xs relative z-10">New Delhi Medical District</p>
              <p className="text-[10px] text-slate-400 mt-0.5 relative z-10">Lat: 28.6139° N, Lon: 77.2090° E</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
