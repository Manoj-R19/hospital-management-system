import { useState } from 'react';
import { 
  Clock, Calendar, User, FileText, Filter, AlertCircle, Eye, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientHistory = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const mockHistory = [
    { id: 'h1', doctorName: 'Dr. Suresh Kumar', specialization: 'General Physician', hospitalName: 'CureWell Hospital', date: '2026-06-15', diagnosis: 'Acute Bronchitis', notes: 'Advised rest for 3 days. Prescribed antibiotics course. Nebulize if chest congestion worsens.', followUpDate: '2026-06-22', medicines: 'Amoxicillin 500mg, Montelukast 10mg' },
    { id: 'h2', doctorName: 'Dr. Anita Desai', specialization: 'Pediatrician', hospitalName: 'CureWell Kids Care', date: '2026-05-12', diagnosis: 'Viral Influenza', notes: 'High grade fever with body aches. Prescribed antipyretic syrup and hydration fluids.', followUpDate: 'None', medicines: 'Paracetamol syrup, Electrolyte Oral Solution' },
    { id: 'h3', doctorName: 'Dr. Suresh Kumar', specialization: 'General Physician', hospitalName: 'CureWell Hospital', date: '2026-01-20', diagnosis: 'Asthmatic Wheezing', notes: 'Dry cough with nocturnal wheezing. Avoid dust, pollen, and aerosols.', followUpDate: '2026-02-05', medicines: 'Salbutamol Inhaler (SOS), Levocetirizine' }
  ];

  const handleInspect = (h) => {
    toast.success(`Opening detailed consultation card for visit on ${h.date}`);
  };

  const filtered = mockHistory.filter(h => {
    const matchesSearch = 
      h.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.medicines.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDate = !dateFilter || h.date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-650" /> Visit History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your historical clinical visits, diagnosis notes, and past medicine logs.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctor, diagnosis, medicines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end px-2 text-xs font-bold text-slate-500">
          Total consultations on record: {filtered.length} visits
        </div>
      </div>

      {/* Timeline List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <AlertCircle className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Historical Records Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try relaxing filters or select another checkup date.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200/80 ml-6 pl-8 space-y-8 py-4">
          {filtered.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-650 flex items-center justify-center shadow-md">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>

              {/* Card */}
              <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-blue-200 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Checkup with Dr. {item.doctorName}</h3>
                    <p className="text-[10px] text-slate-450 font-semibold">{item.specialization} &bull; {item.hospitalName}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    {item.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                    <p className="text-xs font-bold text-blue-705 text-blue-800">{item.diagnosis}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider block">Prescribed Drugs</span>
                    <p className="text-xs font-semibold text-slate-700">{item.medicines}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/20 border border-blue-100/30 rounded-xl text-xs">
                  <span className="font-bold text-blue-900 uppercase text-[8px] tracking-wider block mb-1">Clinical notes / Observation summary</span>
                  <p className="text-slate-700 leading-relaxed font-semibold">{item.notes}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
                  <span>Next scheduled follow-up: <strong className="text-teal-600 font-bold">{item.followUpDate}</strong></span>
                  <button 
                    onClick={() => handleInspect(item)}
                    className="flex items-center gap-1 text-blue-650 hover:text-blue-700"
                  >
                    Inspect Record <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PatientHistory;
