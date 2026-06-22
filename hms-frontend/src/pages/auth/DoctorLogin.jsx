import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { Stethoscope, Mail, Lock } from 'lucide-react';

const DoctorLogin = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const onSubmit = async (data) => {
    try {
      const response = await authApi.doctorLogin(data);
      login(response.data);
      toast.success('Welcome back, Doctor');
      navigate('/doctor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-slate-500 hover:text-teal-600 font-semibold flex items-center gap-1.5 text-xs transition-colors bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-100">
            &larr; Back
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CureWell HMS</span>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100">
              <Stethoscope className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Doctor Login</h2>
          <p className="text-slate-500 text-xs mt-1">Enter your credentials to access EMR</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-650 mb-1.5 ml-1">Email or Phone</label>
            <div className="relative">
              <input 
                {...register('username', { required: 'Identifier is required' })}
                className="input-field pl-10" 
                placeholder="doctor@curewell.com"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-650 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input 
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field pl-10" 
                placeholder="••••••••"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-teal mt-8 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-450">
          New to CureWell?{' '}
          <Link to="/register" className="text-teal-600 font-bold hover:text-teal-750 transition-colors">
            Register as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
