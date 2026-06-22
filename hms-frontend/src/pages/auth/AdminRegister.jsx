import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { Activity, User, Lock, Shield, Eye, EyeOff, Mail, Phone, Building2 } from 'lucide-react';

const AdminRegister = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch('password');


  const onSubmit = async (data) => {
    try {
      await authApi.registerAdmin({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Admin account created! Please log in.');
      navigate('/login/admin');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/20 to-slate-50 flex flex-col relative">
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/60 bg-white/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-slate-800">CureWell <span className="text-brand-600">HMS</span></span>
        </Link>
        <Link to="/login/admin" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
          Already have an account? <span className="text-brand-600 font-semibold">Sign In</span>
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-500/30">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">Administrator Registration</h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Create a system administrator account to manage hospital operations, staff, and configurations.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* ─── Section 1: Admin Identity ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-1">
              <div className="section-header">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                Admin Identity
              </div>

              <div className="space-y-5">
                <div>
                  <label className="field-label">Full Name</label>
                  <div className="relative">
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      className="input-field pl-10"
                      placeholder="e.g. Hospital Administrator"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="field-label">Official Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="input-field pl-10"
                      placeholder="admin@curewell.hospital"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="field-label">Phone Number</label>
                  <div className="relative">
                    <input
                      {...register('phoneNumber', { 
                        required: 'Phone number is required',
                        pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' }
                      })}
                      className="input-field pl-10"
                      placeholder="+91 98765 43210"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phoneNumber.message}</p>}
                </div>
              </div>
            </div>

          {/* ───────────────── Hospital Information ───────────────── */}

<div className="premium-card-static p-8 animate-fade-in-up-delay-2">
  <div className="section-header">
    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
      <Activity className="w-4 h-4 text-brand-600" />
    </div>

    Hospital Information
  </div>

  <div className="space-y-5">

    {/* Hospital Name */}

    <div>
      <label className="field-label">
        Hospital Name
      </label>

      <div className="relative">
        <input
          {...register("hospitalName", {
            required: "Hospital name is required"
          })}
          className="input-field pl-10"
          placeholder="ABC Multi Speciality Hospital"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Building2 className="w-4 h-4" />
        </span>
      </div>

      {errors.hospitalName && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.hospitalName.message}
        </p>
      )}
    </div>

    {/* Hospital Type */}

    <div>
      <label className="field-label">
        Hospital Type
      </label>

      <div className="relative">
        <select
          {...register("hospitalType", {
            required: "Hospital type is required"
          })}
          className="input-field pl-10 text-slate-700"
        >
          <option value="">Select Hospital Type</option>

          <option>Government Hospital</option>

          <option>Private Hospital</option>

          <option>Multi Speciality Hospital</option>

          <option>Clinic</option>

          <option>Diagnostic Centre</option>

        </select>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Activity className="w-4 h-4" />
        </span>
      </div>

      {errors.hospitalType && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.hospitalType.message}
        </p>
      )}
    </div>

    {/* Hospital Email */}

    <div>
      <label className="field-label">
        Hospital Email
      </label>

      <div className="relative">
        <input
          type="email"
          {...register("hospitalEmail", {
            required: "Hospital email is required"
          })}
          className="input-field pl-10"
          placeholder="hospital@gmail.com"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Mail className="w-4 h-4" />
        </span>
      </div>

      {errors.hospitalEmail && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.hospitalEmail.message}
        </p>
      )}
    </div>

    {/* Hospital Phone */}

    <div>
      <label className="field-label">
        Hospital Phone Number
      </label>

      <div className="relative">
        <input
          {...register("hospitalPhone", {
            required: "Hospital phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Must be 10 digits"
            }
          })}
          className="input-field pl-10"
          placeholder="+91 9876543210"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Phone className="w-4 h-4" />
        </span>
      </div>

      {errors.hospitalPhone && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.hospitalPhone.message}
        </p>
      )}
    </div>

    {/* Registration Number */}

    <div>
      <label className="field-label">
        Hospital Registration Number
      </label>

      <div className="relative">
        <input
          {...register("registrationNumber", {
            required: "Registration number is required"
          })}
          className="input-field pl-10"
          placeholder="REG-2026-00001"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Shield className="w-4 h-4" />
        </span>
      </div>

      {errors.registrationNumber && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.registrationNumber.message}
        </p>
      )}
    </div>

    {/* License Number */}

    <div>
      <label className="field-label">
        Hospital License Number
      </label>

      <div className="relative">
        <input
          {...register("licenseNumber", {
            required: "License number is required"
          })}
          className="input-field pl-10"
          placeholder="LIC-2026-00001"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Shield className="w-4 h-4" />
        </span>
      </div>

      {errors.licenseNumber && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errors.licenseNumber.message}
        </p>
      )}
    </div>

  </div>
</div>

            {/* ─── Section 2: Security & Authorization ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-2">
              <div className="section-header">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-brand-600" />
                </div>
                Security & Authorization
              </div>

              <div className="space-y-5">


                <div className="relative">
                  <label className="field-label">Account Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Min. 8 characters' }
                      })}
                      className="input-field pr-12 pl-10"
                      placeholder="Min. 8 characters"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
                </div>

                <div className="relative">
                  <label className="field-label">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: v => v === password || 'Passwords do not match'
                      })}
                      className="input-field pr-12 pl-10"
                      placeholder="Repeat password"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>


            {/* ─── Submit ─── */}
            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('consent', { required: 'You must agree to the terms' })}
                  className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                  I acknowledge the administrative responsibilities and agree to the <a href="#" className="text-brand-600 font-semibold hover:underline">System Usage Policy</a> and data governance terms.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs ml-8">{errors.consent.message}</p>}

              <button type="submit" disabled={isSubmitting} className="btn-primary text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : 'Create Admin Account'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminRegister;
