import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { Stethoscope, User, Lock, Building2, GraduationCap, Upload, FileText, X, Eye, EyeOff } from 'lucide-react';

const DoctorRegister = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const password = watch('password');

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || e.target.files || []);
    const validFiles = droppedFiles.filter(f =>
      ['application/pdf', 'image/jpeg', 'image/png'].includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      await authApi.registerDoctor?.({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        qualification: data.qualification,
        specialization: data.specialization,
        govtRegNumber: data.govtRegNumber,
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        hospitalOpeningTime: data.hospitalOpeningTime,
        hospitalClosingTime: data.hospitalClosingTime,
        hospitalFacilities: data.facilities || [],
        password: data.password,
      });
      toast.success('Registration submitted! Await verification.');
      navigate('/login/doctor');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/60 bg-white/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-slate-800">CureWell <span className="text-teal-600">HMS</span></span>
        </Link>
        <Link to="/login/doctor" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
          Already registered? <span className="text-teal-600 font-semibold">Sign In</span>
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-teal-500/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">Doctor Registration</h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Register as a medical professional to access the EMR system. Your profile will be verified by the hospital administration.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ─── Section 1: Professional Identity ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-1">
              <div className="section-header-teal">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                Professional Identity
              </div>

              <div className="space-y-5">
                <div>
                  <label className="field-label">Full Name (with Title)</label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input-field"
                    placeholder="e.g. Dr. Priya Sharma"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="input-field"
                      placeholder="dr.priya@hospital.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="field-label">Phone Number</label>
                    <input
                      {...register('phoneNumber', { 
                        required: 'Phone is required',
                        pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' }
                      })}
                      className="input-field"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 2: Medical Credentials ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-2">
              <div className="section-header-teal">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                </div>
                Medical Credentials
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
  <label className="field-label">Qualification</label>

  <select
    {...register("qualification", {
      required: "Qualification is required"
    })}
    className="input-field"
  >
    <option value="">Select Qualification</option>

    <option>MBBS</option>

    <option>MBBS, MD</option>

    <option>MBBS, MS</option>

    <option>MBBS, DM</option>

    <option>MBBS, MCh</option>

    <option>BDS</option>

    <option>BDS, MDS</option>

    <option>BAMS</option>

    <option>BHMS</option>

    <option>BUMS</option>

    <option>BNYS</option>

    <option>MD</option>

    <option>MS</option>

    <option>DM</option>

    <option>MCh</option>

    <option>DNB</option>

    <option>PhD</option>

  </select>

  {errors.qualification && (
    <p className="text-red-500 text-xs mt-1.5 ml-1">
      {errors.qualification.message}
    </p>
  )}
</div>
<div>
<div>
  <label className="field-label">Specialization</label>

  <select
    {...register("specialization", {
      required: "Specialization is required"
    })}
    className="input-field"
  >
    <option value="">Select Specialization</option>

    <option>General Physician</option>

    <option>Cardiology</option>

    <option>Neurology</option>

    <option>Orthopedics</option>

    <option>Dermatology</option>

    <option>Pediatrics</option>

    <option>Gynecology</option>

    <option>ENT</option>

    <option>Oncology</option>

    <option>Psychiatry</option>

    <option>Nephrology</option>

    <option>Urology</option>

    <option>Pulmonology</option>

    <option>Gastroenterology</option>

    <option>Ophthalmology</option>

    <option>Dentistry</option>

    <option>Anesthesiology</option>

    <option>Radiology</option>

    <option>Pathology</option>

    <option>Emergency Medicine</option>

    <option>Family Medicine</option>

    <option>Endocrinology</option>

    <option>Rheumatology</option>

    <option>Plastic Surgery</option>

    <option>Neurosurgery</option>

    <option>Cardiothoracic Surgery</option>

  </select>

  {errors.specialization && (
    <p className="text-red-500 text-xs mt-1.5 ml-1">
      {errors.specialization.message}
    </p>
  )}
</div>
                    {errors.specialization && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.specialization.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="field-label">Government Registration Number</label>
                  <input
                    {...register('govtRegNumber', { required: 'Registration number is required' })}
                    className="input-field font-mono tracking-wider"
                    placeholder="e.g. MCI-2024-XXXXX"
                  />
                  {errors.govtRegNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.govtRegNumber.message}</p>}
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="field-label">Upload Certificates & Licenses</label>
                  <div
                    className="file-drop-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileDrop}
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-3 border border-teal-100">
                        <Upload className="w-6 h-6 text-teal-400" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        Drop files here or <span className="text-teal-600 underline underline-offset-2">browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Medical license, degree certificates (PDF, JPG, PNG up to 5MB)</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200">
                          <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                          <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
                          <span className="text-xs text-slate-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                          <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Section 3: Hospital Affiliation ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-3">
              <div className="section-header-teal">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-teal-600" />
                </div>
                Hospital & Practice Details
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Hospital / Clinic Name</label>
                    <input
                      {...register('hospitalName', { required: 'Required' })}
                      className="input-field"
                      placeholder="e.g. CureWell Central"
                    />
                  </div>
                  <div>
                    <label className="field-label">Full Address</label>
                    <input
                      {...register('hospitalAddress', { required: 'Required' })}
                      className="input-field"
                      placeholder="Location of practice"
                    />
                  </div>
                  <div>
                    <label className="field-label">Opening Time</label>
                    <input type="time" {...register('hospitalOpeningTime', { required: true })} className="input-field" />
                  </div>
                  <div>
                    <label className="field-label">Closing Time</label>
                    <input type="time" {...register('hospitalClosingTime', { required: true })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Facilities Available</label>
                  <div>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">

    {[
      "Emergency",
      "ICU",
      "NICU",
      "Blood Bank",
      "Ambulance",
      "Pharmacy",
      "Laboratory",
      "MRI",
      "CT Scan",
      "PET Scan",
      "X-Ray",
      "Ultrasound",
      "Dialysis",
      "Operation Theatre",
      "Cath Lab",
      "Physiotherapy",
      "Vaccination",
      "ECG",
      "ECHO",
      "Ventilator",
      "Trauma Care",
      "24x7 Pharmacy"
    ].map((facility) => (
      <label
        key={facility}
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          value={facility}
          {...register("facilities")}
          className="w-4 h-4 text-brand-600 rounded"
        />

        <span className="text-sm text-slate-700">
          {facility}
        </span>
      </label>
    ))}

  </div>
</div>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Account Security ─── */}
            <div className="premium-card-static p-8">
              <div className="section-header-teal">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-teal-600" />
                </div>
                Account Security
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <label className="field-label">Account Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min. 8 characters' }
                    })}
                    className="input-field pr-12"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
                </div>

                <div className="relative">
                  <label className="field-label">Confirm Password</label>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: v => v === password || 'Passwords do not match'
                    })}
                    className="input-field pr-12"
                    placeholder="Repeat password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* ─── Consent & Submit ─── */}
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Your account will require admin verification before you can access the clinical portal. You'll be notified once approved.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('consent', { required: 'You must agree to the terms' })}
                  className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 cursor-pointer"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                  I certify that my medical credentials are accurate and agree to the <a href="#" className="text-teal-600 font-semibold hover:underline">Medical Practice Policy</a> and code of conduct.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs ml-8">{errors.consent.message}</p>}

              <button type="submit" disabled={isSubmitting} className="btn-teal text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DoctorRegister;
