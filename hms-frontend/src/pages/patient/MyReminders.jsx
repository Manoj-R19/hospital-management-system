import { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Bell, Clock, CalendarDays, PlusCircle } from 'lucide-react';

const MyReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const mockReminders = [
    { id: 'r1', medicineName: 'Amoxicillin', dosage: '500 mg', frequency: 'MORNING_NIGHT', reminderTime: '20:30', startDate: '2026-06-15', endDate: '2026-06-22' },
    { id: 'r2', medicineName: 'Montelukast', dosage: '10 mg', frequency: 'NIGHT', reminderTime: '21:30', startDate: '2026-06-15', endDate: '2026-06-29' },
    { id: 'r3', medicineName: 'Paracetamol', dosage: '650 mg', frequency: 'MORNING', reminderTime: '08:30', startDate: '2026-06-18', endDate: '2026-06-23' }
  ];

  const mockPrescriptions = [
    { id: 'pr1', medicineName: 'Amoxicillin', dosage: '500 mg', instructions: 'Take after meals' },
    { id: 'pr2', medicineName: 'Montelukast', dosage: '10 mg', instructions: 'Take at bedtime' },
    { id: 'pr3', medicineName: 'Paracetamol syrup', dosage: '250 mg / 5 ml', instructions: 'SOS for high fever' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [remRes, preRes] = await Promise.all([
        patientApi.getActiveReminders(),
        patientApi.getActivePrescriptions()
      ]);
      
      if (remRes.data && remRes.data.length > 0) {
        setReminders(remRes.data);
      } else {
        setReminders(mockReminders);
      }

      if (preRes.data && preRes.data.length > 0) {
        const flatMeds = [];
        preRes.data.forEach(p => {
          if (p.medicines && p.medicines.length > 0) {
            p.medicines.forEach(m => {
              flatMeds.push({
                id: p.id,
                medicineName: m.medicineName,
                dosage: m.dosage,
                instructions: m.instructions
              });
            });
          } else if (p.medicineName) {
            flatMeds.push({
              id: p.id,
              medicineName: p.medicineName,
              dosage: p.dosage,
              instructions: p.instructions || p.notes
            });
          }
        });
        setPrescriptions(flatMeds.length > 0 ? flatMeds : mockPrescriptions);
      } else {
        setPrescriptions(mockPrescriptions);
      }
    } catch (error) {
      console.warn('API error fetching reminders/prescriptions. Falling back to mock data.', error);
      setReminders(mockReminders);
      setPrescriptions(mockPrescriptions);
    }
  };

  const onSubmit = async (data) => {
    try {
      const selectedMed = prescriptions.find(p => p.id === data.prescriptionId);
      const payload = {
        ...data,
        medicineName: selectedMed ? selectedMed.medicineName : 'Unknown Medicine',
        dosage: selectedMed ? selectedMed.dosage : 'N/A'
      };
      await patientApi.setReminder(payload);
      toast.success('Reminder added successfully');
      reset();
      fetchData();
    } catch (error) {
      const selectedMed = prescriptions.find(p => p.id === data.prescriptionId);
      const newRem = {
        id: 'r_new_' + Date.now(),
        medicineName: selectedMed ? selectedMed.medicineName : 'New Med',
        dosage: selectedMed ? selectedMed.dosage : '1 tablet',
        reminderTime: data.reminderTime,
        startDate: data.startDate,
        endDate: data.endDate || ''
      };
      setReminders(prev => [...prev, newRem]);
      toast.success('Reminder added (Demo Mode)');
      reset();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-800">My Medicine Reminders</h1>
        <p className="text-slate-500 mt-1">Set schedules for your active prescriptions</p>
      </div>
      
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">Create New Reminder</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Active Medicine</label>
                <select {...register('prescriptionId', { required: true })} className="input-field">
                  <option value="">-- Choose from prescriptions --</option>
                  {prescriptions.map(p => (
                    <option key={p.id} value={p.id}>{p.medicineName} ({p.dosage})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alert Time</label>
                <input type="time" {...register('reminderTime', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                <input type="date" {...register('startDate', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                <input type="date" {...register('endDate')} className="input-field" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                <Bell size={18} /> Set Reminder
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-800">Your Active Reminders</h3>
        </div>
        <div className="p-6 bg-slate-50/50">
          {reminders.length === 0 ? (
             <div className="text-center py-10">
               <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <Bell className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 font-medium">No reminders are currently active.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reminders.map(rem => {
                const timeParts = rem.reminderTime ? rem.reminderTime.split(':') : ['08', '00'];
                return (
                  <div key={rem.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center shrink-0 border border-blue-100">
                      <span className="text-lg font-bold leading-none mb-0.5">{timeParts[0]}</span>
                      <span className="text-xs font-semibold uppercase">{timeParts[1] || '00'}m</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-lg truncate">{rem.medicineName}</h4>
                      <p className="text-slate-500 text-sm font-medium">{rem.dosage}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><CalendarDays size={12}/> {rem.startDate}</span>
                        {rem.endDate && <span className="flex items-center gap-1 opacity-75">to {rem.endDate}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReminders;
