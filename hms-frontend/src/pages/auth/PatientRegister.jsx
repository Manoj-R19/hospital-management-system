import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { HeartPulse, User, Lock, Stethoscope, Upload, FileText, X, Eye, EyeOff, Mail, Phone, Shield, Calendar, MapPin, Clock, Building2 } from 'lucide-react';

const PatientRegister = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const password = watch('password');
  const takingMedicines = watch("takingMedicines");
  const previousSurgery = watch("previousSurgery");

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

  const loadExampleScans = async () => {
    try {
      const scans = [
        { name: 'mri_scan_example.png', url: '/example_scan_1.png' },
        { name: 'blood_report_example.png', url: '/example_scan_2.png' },
        { name: 'xray_report_example.png', url: '/example_scan_3.png' }
      ];
      
      const fileObjects = await Promise.all(
        scans.map(async (scan) => {
          const res = await fetch(scan.url);
          const blob = await res.blob();
          return new File([blob], scan.name, { type: 'image/png' });
        })
      );
      
      setFiles(prev => [...prev, ...fileObjects].slice(0, 5));
      toast.success('Example scans loaded successfully!');
    } catch (err) {
      toast.error('Failed to load example scans.');
    }
  };

  const onSubmit = async (data) => {
    try {
      await authApi.registerPatient({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        aadhaarNumber: data.aadhaarNumber,
        age: parseInt(data.age, 10),
        gender: data.gender,
        address: data.address,
        password: data.password,
        hasInsurance: data.hasInsurance === 'Yes',
        insuranceProvider: data.insuranceProvider || null,
        policyNumber: data.policyNumber || null,
        bloodGroup: data.bloodGroup || null,
        height: data.height ? parseFloat(data.height) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        medicalConditions: data.medicalConditions || [],
        allergies: data.allergies || [],
        takingMedicines: data.takingMedicines === 'Yes',
        medicineName: data.medicineName || null,
        dosage: data.dosage || null,
        frequency: data.frequency || null,
        medicineTime: data.medicineTime || [],
        medicineReason: data.medicineReason || null,
        medicineDuration: data.medicineDuration || null,
        previousSurgery: data.previousSurgery === 'Yes',
        surgeryName: data.surgeryName || null,
        surgeryType: data.surgeryType || null,
        surgeryHospital: data.surgeryHospital || null,
        surgeonName: data.surgeonName || null,
        surgeryDate: data.surgeryDate || null,
        recoveryDuration: data.recoveryDuration || null,
        surgeryReason: data.surgeryReason || null,
        currentHealthStatus: data.currentHealthStatus || null,
        smoking: data.smoking === 'Yes',
        alcohol: data.alcohol === 'Yes',
        emergencyContactName: data.EmergencyContactName,
        emergencyContactNumber: data.EmergencyContactNumber,
        emergencyRelationship: data.EmergencyRelationship,
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login/patient');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/60 bg-white/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-slate-800">CureWell <span className="text-brand-600">HMS</span></span>
        </Link>
        <Link to="/login/patient" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
          Already have an account? <span className="text-brand-600 font-semibold">Sign In</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Hero intro */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-500/30">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">Create Your Health Profile</h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Create a secure medical profile to begin your journey with CureWell Healthcare. Your data is encrypted and protected.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* ─── Section 1: Identity Details ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-1">
              <div className="section-header-blue">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Identity Details
              </div>

              <div className="space-y-5">
                <div>
                  <label className="field-label">Full Name</label>
                  <div className="relative">
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      className="input-field pl-10"
                      placeholder="e.g. Julian Vance"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="field-label">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="input-field pl-10"
                      placeholder="julian.vance@example.com"
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
                        required: 'Phone is required',
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

                <div>
                  <label className="field-label">Unique Patient ID (Aadhaar)</label>
                  <div className="relative">
                    <input
                      {...register('aadhaarNumber', {
                        required: 'Aadhaar is required',
                        pattern: { value: /^\d{12}$/, message: 'Must be exactly 12 digits' }
                      })}
                      className="input-field pl-10 tracking-widest font-mono"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Shield className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.aadhaarNumber.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Age</label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register('age', { required: 'Age is required', min: { value: 1, message: 'Invalid age' } })}
                        className="input-field pl-10"
                        placeholder="25"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                    </div>
                    {errors.age && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.age.message}</p>}
                  </div>
                  <div>
                    <label className="field-label">Gender</label>
                    <select {...register('gender', { required: true })} className="input-field text-slate-700">
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 2: Living & Security ─── */}
            <div className="premium-card-static p-8 animate-fade-in-up-delay-2">
              <div className="section-header-blue">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                Living & Security
              </div>

              <div className="space-y-5">
                <div>
                  <label className="field-label">Residential Address</label>
                  <div className="relative">
                    <input
                      {...register('address', { required: 'Address is required' })}
                      className="input-field pl-10"
                      placeholder="Enter your full street address..."
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.address.message}</p>}
                </div>

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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
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
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      className="input-field pr-12 pl-10"
                      placeholder="Repeat password"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* ─── Section 3: Health Profile ─── */}
            {/* ─────────────────────────────
        HEALTH PROFILE
───────────────────────────── */}

<div className="premium-card-static p-8 animate-fade-in-up-delay-3">
  <div className="section-header-blue">
    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
      <Stethoscope className="w-4 h-4 text-blue-600" />
    </div>
    Health Profile
  </div>

  <div className="space-y-6">

    {/* Health Insurance */}
    <div>
      <label className="field-label">Do you have Health Insurance?</label>

      <div className="flex gap-8 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="Yes"
            {...register("hasInsurance")}
          />
          Yes
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="No"
            {...register("hasInsurance")}
          />
          No
        </label>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>
        <label className="field-label">
          Insurance Provider
        </label>

        <input
          {...register("insuranceProvider")}
          className="input-field"
          placeholder="Star Health"
        />
      </div>

      <div>
        <label className="field-label">
          Policy Number
        </label>

        <input
          {...register("policyNumber")}
          className="input-field"
          placeholder="Policy Number"
        />
      </div>

    </div>

    {/* Blood Group */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>

        <label className="field-label">
          Blood Group
        </label>

        <select
          {...register("bloodGroup")}
          className="input-field"
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

      </div>

      <div>

        <label className="field-label">
          Height (cm)
        </label>

        <input
          type="number"
          {...register("height")}
          className="input-field"
        />

      </div>

      <div>

        <label className="field-label">
          Weight (kg)
        </label>

        <input
          type="number"
          {...register("weight")}
          className="input-field"
        />

      </div>

    </div>

    {/* Medical Conditions */}

    <div>

      <label className="field-label">
        Existing Medical Conditions
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">

        {[
          "Diabetes",
          "Hypertension",
          "Asthma",
          "Heart Disease",
          "Kidney Disease",
          "Liver Disease",
          "Cancer",
          "Thyroid",
          "Stroke",
          "Epilepsy",
          "Arthritis",
          "None",
          "Others"
        ].map((condition) => (

          <label
            key={condition}
            className="flex items-center gap-2"
          >

            <input
              type="checkbox"
              value={condition}
              {...register("medicalConditions")}
            />

            {condition}

          </label>

        ))}

      </div>

    </div>

    {/* Allergies */}

    <div>

      <label className="field-label">
        Allergies
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">

        {[
          "Penicillin",
          "Food Allergy",
          "Dust Allergy",
          "Latex",
          "Animal Allergy",
          "No Allergy",
          "Others"
        ].map((allergy) => (

          <label
            key={allergy}
            className="flex items-center gap-2"
          >

            <input
              type="checkbox"
              value={allergy}
              {...register("allergies")}
            />

            {allergy}

          </label>

        ))}

      </div>

    </div>

  {/* Current Medicines */}

<div className="space-y-5">

  <div className="section-header-blue">
    Current Medication Details
  </div>

  <div>
    <div className="flex gap-8 mt-2">
     <div>
  <label className="field-label">
    Are you currently taking any medicines?
  </label>

  <div className="flex gap-8 mt-2">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="Yes"
        {...register("takingMedicines")}
      />
      Yes
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="No"
        {...register("takingMedicines")}
      />
      No
    </label>

  </div>
</div>
    </div>
  </div>
</div>
 {takingMedicines === "Yes" && (

  <div className="mt-6 space-y-5">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* Medicine Name */}
      <div>
        <label className="field-label">
          Medicine Name
        </label>

        <input
          {...register("medicineName")}
          className="input-field"
          placeholder="e.g. Metformin"
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="field-label">
          Dosage
        </label>

        <input
          {...register("dosage")}
          className="input-field"
          placeholder="500 mg"
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="field-label">
          Frequency
        </label>

        <select
          {...register("frequency")}
          className="input-field"
        >
          <option value="">Select</option>
          <option>Once Daily</option>
          <option>Twice Daily</option>
          <option>Three Times Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>As Needed</option>
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="field-label">
          Duration
        </label>

        <input
          {...register("medicineDuration")}
          className="input-field"
          placeholder="6 Months"
        />
      </div>

    </div>

    {/* Medicine Time */}

    <div>

      <label className="field-label">
        Time
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="Morning"
            {...register("medicineTime")}
          />
          Morning
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="Afternoon"
            {...register("medicineTime")}
          />
          Afternoon
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="Evening"
            {...register("medicineTime")}
          />
          Evening
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="Night"
            {...register("medicineTime")}
          />
          Night
        </label>

      </div>

    </div>

    {/* Reason */}

    <div>

      <label className="field-label">
        Reason for Medication
      </label>

      <input
        {...register("medicineReason")}
        className="input-field"
        placeholder="Diabetes / BP / Fever"
      />

    </div>

  </div>

)}

    {/* Previous Surgery */}

    <div>
  <label className="field-label">
    Previous Surgery
  </label>

  <div className="flex gap-8 mt-2">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="Yes"
        {...register("previousSurgery")}
      />
      Yes
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="No"
        {...register("previousSurgery")}
      />
      No
    </label>

  </div>
</div>
{previousSurgery === "Yes" && (

<div className="mt-6 space-y-5">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {/* Surgery Name */}
    <div>
      <label className="field-label">
        Surgery Name
      </label>

      <input
        {...register("surgeryName")}
        className="input-field"
        placeholder="e.g. Heart Bypass Surgery"
      />
    </div>

    {/* Surgery Type */}
    <div>
      <label className="field-label">
        Surgery Type
      </label>

      <select
        {...register("surgeryType")}
        className="input-field"
      >
        <option value="">Select Surgery Type</option>
        <option>Cardiac Surgery</option>
        <option>Neurosurgery</option>
        <option>Orthopedic Surgery</option>
        <option>General Surgery</option>
        <option>Plastic Surgery</option>
        <option>ENT Surgery</option>
        <option>Eye Surgery</option>
        <option>Gynecological Surgery</option>
        <option>Urology Surgery</option>
        <option>Other</option>
      </select>
    </div>

    {/* Hospital Name */}
    <div>
      <label className="field-label">
        Hospital Name
      </label>

      <input
        {...register("surgeryHospital")}
        className="input-field"
        placeholder="Apollo Hospital"
      />
    </div>

    {/* Doctor Name */}
    <div>
      <label className="field-label">
        Surgeon Name
      </label>

      <input
        {...register("surgeonName")}
        className="input-field"
        placeholder="Dr. John"
      />
    </div>

    {/* Date */}
    <div>
      <label className="field-label">
        Surgery Date
      </label>

      <input
        type="date"
        {...register("surgeryDate")}
        className="input-field"
      />
    </div>

    {/* Duration */}
    <div>
      <label className="field-label">
        Recovery Duration
      </label>

      <input
        {...register("recoveryDuration")}
        className="input-field"
        placeholder="3 Months"
      />
    </div>

  </div>

  {/* Reason */}

  <div>
    <label className="field-label">
      Reason for Surgery
    </label>

    <textarea
      rows="3"
      {...register("surgeryReason")}
      className="input-field resize-none"
      placeholder="Reason for surgery..."
    />
  </div>

  {/* Current Status */}

  <div>
    <label className="field-label">
      Current Health Status
    </label>

    <select
      {...register("currentHealthStatus")}
      className="input-field"
    >
      <option value="">Select</option>
      <option>Fully Recovered</option>
      <option>Under Medication</option>
      <option>Regular Follow-up</option>
      <option>Still Recovering</option>
    </select>
  </div>

  {/* Upload */}

  <div>
    <label className="field-label">
      Upload Surgery Reports
    </label>

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

        <Upload className="w-8 h-8 text-slate-400 mb-2" />

        <p className="text-sm text-slate-600">
          Upload Surgery Reports, Discharge Summary,
          Scan Reports
        </p>

      </div>

    </div>
  </div>

</div>

)}

    {/* Lifestyle */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>

        <label className="field-label">
          Smoking
        </label>

        <select
          {...register("smoking")}
          className="input-field"
        >
          <option>No</option>
          <option>Yes</option>
        </select>

      </div>

      <div>

        <label className="field-label">
          Alcohol
        </label>

        <select
          {...register("alcohol")}
          className="input-field"
        >
          <option>No</option>
          <option>Yes</option>
        </select>

      </div>

    </div>

    {/* Medical Reports */}

    <div>

      <label className="field-label">
        Upload Medical Reports
      </label>

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

          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">

            <Upload className="w-6 h-6 text-slate-400" />

          </div>

          <p className="text-sm text-slate-600 font-medium">

            Upload MRI / CT Scan / X-Ray / Blood Reports /
            Prescription / ECG / ECHO

          </p>

        </div>

      </div>

      <div className="mt-3 flex justify-between items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            loadExampleScans();
          }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          ✨ Load Example Scans
        </button>
        <span className="text-xs text-slate-400">Add pre-made MRI, Blood, and X-Ray scan examples</span>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200">
              <FileText className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
              <span className="text-xs text-slate-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>

    {/* Emergency Contact */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      <div>

        <label className="field-label">
          Emergency Contact Name
        </label>
        <div className="relative">
          <input
            {...register('EmergencyContactName', { required: 'Full name is required' })}
            className="input-field pl-10"
            placeholder="e.g. Julian Vance"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <User className="w-4 h-4" />
          </span>
        </div>

      </div>

      <div>

        <label className="field-label">
          Emergency Contact Number
        </label>

        <div className="relative">
          <input
            {...register("EmergencyContactNumber", { required: 'Contact number is required' })}
            className="input-field pl-10"
            placeholder="+91 9876943210"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Phone className="w-4 h-4" />
          </span>
        </div>

      </div>

      <div>

        <label className="field-label">
          Emergency Relationship
        </label>

        <div className="relative">
          <input
            {...register("EmergencyRelationship", { required: 'Relationship is required' })}
            className="input-field pl-10"
            placeholder="e.g. Spouse / Sibling"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <HeartPulse className="w-4 h-4" />
          </span>
        </div>

      </div>

    </div>

  </div>
</div>

            {/* ─── Consent & Submit ─── */}
            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('consent', { required: 'You must agree to the privacy policy' })}
                  className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                  I agree to the <a href="#" className="text-brand-600 font-semibold hover:underline">HIPAA Privacy Policy</a> and consent to data usage in accordance with CureWell's terms.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs ml-8">{errors.consent.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PatientRegister;
