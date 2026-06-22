import { Link } from 'react-router-dom';
import { Activity, Stethoscope, HeartPulse, ShieldAlert, ArrowLeft } from 'lucide-react';

const RegisterRoleSelection = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-6 flex justify-start">
          <Link to="/" className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1.5 text-sm transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100">
              <Activity className="w-8 h-8 text-blue-650" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-500 mt-2">Select your portal role to register and join the CureWell Healthcare network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Admin Registration */}
          <Link 
            to="/register/admin" 
            className="premium-card bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center group hover:border-blue-200"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Register as Admin</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create an administrative profile to configure clinic assets, oversee hospital personnel, and manage billing logs.
            </p>
          </Link>

          {/* Doctor Registration */}
          <Link 
            to="/register/doctor" 
            className="premium-card bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center group hover:border-teal-200"
          >
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Register as Doctor</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a clinical specialist profile to consult patients, issue active prescriptions, and maintain EMR records.
            </p>
          </Link>

          {/* Patient Registration */}
          <Link 
            to="/register/patient" 
            className="premium-card bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center group hover:border-indigo-200"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <HeartPulse className="w-8 h-8 text-indigo-650" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Register as Patient</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a personal health profile to manage appointments, track token queues, set pill intake logs, and view reports.
            </p>
          </Link>

        </div>

        <div className="mt-12 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login/patient" className="text-blue-600 hover:text-blue-750 font-bold transition-colors">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterRoleSelection;
