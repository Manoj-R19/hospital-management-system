import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Building2 } from 'lucide-react';

const RegisterDoctor = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        hospitalFacilities: data.hospitalFacilities.split(',').map(f => f.trim())
      };
      await adminApi.registerDoctor(payload);
      toast.success('Doctor registered successfully');
      navigate('/admin/doctors');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register doctor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-slate-800">Register Medical Professional</h1>
        <p className="text-slate-500 mt-1">Add a new doctor to the hospital network</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Personal Details */}
        <div className="premium-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Professional Details</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input {...register('fullName', { required: true })} className="input-field" placeholder="Dr. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" {...register('email', { required: true })} className="input-field" placeholder="doctor@hospital.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input {...register('phoneNumber', { required: true })} className="input-field" placeholder="Mobile number" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Govt Reg Number <span className="text-red-500">*</span></label>
                <input {...register('govtRegNumber', { required: true })} className="input-field" placeholder="Medical Council Reg No." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification <span className="text-red-500">*</span></label>
                <input {...register('qualification', { required: true })} className="input-field" placeholder="e.g. MBBS, MD" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                <input {...register('specialization', { required: true })} className="input-field" placeholder="e.g. Cardiology, General Medicine" />
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Details */}
        <div className="premium-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Hospital & Clinic Information</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital/Clinic Name <span className="text-red-500">*</span></label>
                <input {...register('hospitalName', { required: true })} className="input-field" placeholder="Name of practice" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                <input {...register('hospitalAddress', { required: true })} className="input-field" placeholder="Location" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Opening Time <span className="text-red-500">*</span></label>
                <input type="time" {...register('hospitalOpeningTime', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Closing Time <span className="text-red-500">*</span></label>
                <input type="time" {...register('hospitalClosingTime', { required: true })} className="input-field" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facilities</label>
                <input {...register('hospitalFacilities')} placeholder="E.g., X-Ray, Pharmacy, ICU (Comma separated)" className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="premium-card p-8">
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Temporary Account Password <span className="text-red-500">*</span></label>
            <input type="password" {...register('password', { required: true })} className="input-field" placeholder="Assign initial password" />
            <p className="text-xs text-slate-500 mt-2">The doctor can change this password after their first login.</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/doctors')} className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:-translate-y-0.5 transition-all">
            Register Professional
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterDoctor;
