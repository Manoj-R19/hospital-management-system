import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { doctorApi } from '../../api/doctorApi';
import { toast } from 'react-hot-toast';
import { Stethoscope, Pill, X, Save, Plus } from 'lucide-react';

const CreateEncounter = () => {
  const { aadhaar } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      prescriptions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptions"
  });

  useEffect(() => {
    doctorApi.getPatientBasicInfo(aadhaar)
      .then(res => setPatient(res.data))
      .catch(() => toast.error('Patient not found'));
  }, [aadhaar]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        patientAadhaar: aadhaar,
        diagnosis: data.diagnosis,
        clinicalNotes: data.clinicalNotes,
        prescriptions: data.prescriptions.map(p => ({
          ...p,
          durationDays: parseInt(p.durationDays, 10)
        }))
      };
      await doctorApi.createEncounter(payload);
      toast.success('Encounter saved successfully');
      navigate(`/doctor/patient/${aadhaar}`);
    } catch (error) {
      toast.error('Failed to save encounter');
    }
  };

  if (!patient) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="premium-card p-6 bg-slate-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
           <Stethoscope className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">New Encounter Record</h2>
          <p className="text-slate-500 font-medium mt-0.5">Patient: <span className="text-slate-700">{patient.fullName}</span> • {patient.gender} • {patient.age} yrs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="premium-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-white">
            <h3 className="text-lg font-bold text-slate-800">Clinical Details</h3>
          </div>
          <div className="p-6 space-y-6 bg-slate-50">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Primary Diagnosis <span className="text-red-500">*</span></label>
              <input 
                {...register('diagnosis', { required: 'Diagnosis is required' })}
                className="input-field text-base font-medium" 
                placeholder="e.g. Viral Fever, Hypertension"
              />
              {errors.diagnosis && <p className="text-red-500 text-xs mt-1 font-medium">{errors.diagnosis.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Notes & Observations</label>
              <textarea 
                {...register('clinicalNotes')}
                rows="4"
                className="input-field resize-none" 
                placeholder="Enter symptoms, vitals, and physician observations..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Pill size={20} className="text-teal-600"/> E-Prescription</h3>
            <button 
              type="button" 
              onClick={() => append({ medicineName: '', dosage: '', frequency: 'MORNING_NIGHT', durationText: '', durationDays: 7, instructions: '' })}
              className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-100 border border-teal-200 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Medicine
            </button>
          </div>

          <div className="p-6 bg-slate-50">
            {fields.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
                <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">No medicines prescribed yet.</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Medicine" to create a prescription entry.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-5 bg-white border border-slate-200 rounded-xl relative shadow-sm hover:border-teal-300 transition-colors">
                    <button 
                      type="button" 
                      onClick={() => remove(index)} 
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1 rounded"
                    >
                      <X size={18} />
                    </button>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-teal-700">
                      <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                      Medicine Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 pr-8">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Medicine Name <span className="text-red-500">*</span></label>
                        <input {...register(`prescriptions.${index}.medicineName`, { required: true })} className="input-field py-2" placeholder="e.g. Paracetamol" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Dosage <span className="text-red-500">*</span></label>
                        <input {...register(`prescriptions.${index}.dosage`, { required: true })} className="input-field py-2" placeholder="e.g. 500mg" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Frequency</label>
                        <select {...register(`prescriptions.${index}.frequency`)} className="input-field py-2 bg-white">
                          <option value="MORNING">Morning (1-0-0)</option>
                          <option value="NIGHT">Night (0-0-1)</option>
                          <option value="MORNING_NIGHT">Morning & Night (1-0-1)</option>
                          <option value="THRICE_DAILY">Thrice Daily (1-1-1)</option>
                          <option value="AFTER_FOOD">After Food (SOS)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Duration (Text)</label>
                        <input {...register(`prescriptions.${index}.durationText`)} placeholder="e.g. 1 week" className="input-field py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Duration (Days)</label>
                        <input type="number" {...register(`prescriptions.${index}.durationDays`)} className="input-field py-2" placeholder="e.g. 7" />
                        <p className="text-[10px] text-slate-400 mt-1">Used for patient reminders</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Special Instructions</label>
                        <input {...register(`prescriptions.${index}.instructions`)} placeholder="e.g. Take after food" className="input-field py-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-1 transition-all flex items-center gap-2 text-lg">
            <Save size={20} /> Complete & Save Encounter
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEncounter;
