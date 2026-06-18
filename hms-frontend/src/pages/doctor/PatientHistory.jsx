import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { toast } from 'react-hot-toast';
import { User, Activity, Clock, PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

const PatientHistory = () => {
  const { aadhaar } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await doctorApi.getPatientHistory(aadhaar);
        setPatientData(res.data);
      } catch (error) {
        toast.error('Failed to load patient history. They may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [aadhaar]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );
  
  if (!patientData) return (
    <div className="text-center py-20">
      <h3 className="text-2xl font-bold text-slate-700 mb-2">Patient Not Found</h3>
      <p className="text-slate-500">No records exist for the provided Aadhaar number.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="premium-card p-8 bg-gradient-to-br from-white to-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-display font-bold text-3xl shadow-inner border-2 border-teal-200">
            {patientData.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">{patientData.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 font-medium">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs"><User size={14}/> ID: {patientData.patientId}</span>
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs">{patientData.age} Years</span>
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs capitalize">{patientData.gender}</span>
            </div>
          </div>
        </div>
        <Link 
          to={`/doctor/patient/${aadhaar}/encounter/new`}
          className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <PlusCircle size={18} /> Start Encounter
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="premium-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-slate-800">Medical Summary</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Existing Conditions</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{patientData.existingConditions || 'No existing conditions reported.'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Past Medical History</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{patientData.pastMedicalHistory || 'No past medical history reported.'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="premium-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-800">Current Medications</h3>
            </div>
            <div className="p-6">
              {patientData.currentMedicines ? (
                 <p className="text-slate-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">{patientData.currentMedicines}</p>
              ) : (
                <p className="text-slate-500 text-center py-4">No active medications reported.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Clock className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-bold text-slate-800">Encounter History</h3>
        </div>
        <div className="p-6">
          {(!patientData.checkupHistory || patientData.checkupHistory.length === 0) ? (
            <div className="text-center py-10">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No previous encounters on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientData.checkupHistory?.map((encounter, index) => (
                <div key={encounter.encounterId} className="border border-slate-200 p-5 rounded-xl hover:border-teal-200 transition-colors bg-white relative">
                  {index === 0 && <span className="absolute -top-3 right-6 bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">Latest</span>}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {encounter.diagnosis || 'General Checkup'}
                      </h4>
                      <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                        Dr. {encounter.doctorName} <span className="text-slate-300">•</span> {encounter.specialization} <span className="text-slate-300">•</span> {encounter.hospitalName}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      {new Date(encounter.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700">
                    <span className="font-semibold text-slate-500 block mb-1">Clinical Notes:</span>
                    {encounter.notes || 'No notes provided.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
