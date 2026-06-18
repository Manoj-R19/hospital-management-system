import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { HeartPulse } from 'lucide-react';

const PatientLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const onSubmit = async (data) => {
    try {
      const response = await authApi.patientLogin(data);
      login(response.data);
      toast.success('Welcome back');
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900">
        <div className="absolute inset-0 bg-blue-900/30 z-10 mix-blend-multiply"></div>
        <img 
          src="/bg.png" 
          alt="Hospital Corridor" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="z-20 relative p-16 flex flex-col justify-end h-full text-white">
          <div className="glass-panel p-8 max-w-lg">
            <h2 className="text-3xl font-display font-bold mb-4">Patient Care Portal</h2>
            <p className="text-white/80 leading-relaxed">Your health, in your hands. Track prescriptions, set medicine reminders, and manage your medical history securely.</p>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 text-brand-600 hover:text-brand-800 font-medium flex items-center text-sm transition-colors">
          &larr; Back to Portal
        </Link>
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <HeartPulse className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900">Patient Login</h2>
            <p className="text-slate-500 mt-2">Access your personal health records</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Email or Phone</label>
              <input 
                {...register('username', { required: 'Identifier is required' })}
                className="input-field" 
                placeholder="your@email.com or Phone"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Password</label>
              <input 
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field" 
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn-primary mt-8">
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register/patient" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
