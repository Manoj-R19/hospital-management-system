import { useState } from 'react';
import { 
  FileText, Download, Share2, Search, Calendar, ChevronRight, Activity, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientReports = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockReports = [
    { id: 'rep1', testName: 'Complete Blood Count (CBC)', date: '2026-06-16', laboratory: 'CureWell Diagnostic Labs', status: 'COMPLETED', diagnosis: 'Normal platelet counts, mild hemoglobin deficit (11.8 g/dL). Recommend iron-rich diet.', doctorName: 'Dr. Suresh Kumar' },
    { id: 'rep2', testName: 'Thyroid Panel (TSH)', date: '2026-06-16', laboratory: 'CureWell Diagnostic Labs', status: 'COMPLETED', diagnosis: 'TSH: 2.4 μIU/mL (Optimal range). No hormonal therapy required.', doctorName: 'Dr. Suresh Kumar' },
    { id: 'rep3', testName: 'Lipid Profile', date: '2026-04-10', laboratory: 'CureWell Diagnostic Labs', status: 'COMPLETED', diagnosis: 'Total Cholesterol: 195 mg/dL (Desirable). HDL: 52 mg/dL. LDL: 110 mg/dL. Continue regular exercises.', doctorName: 'Dr. Suresh Kumar' }
  ];

  const handleDownload = (testName) => {
    toast.success(`Lab Report PDF downloaded: ${testName}.pdf`);
  };

  const handleShare = (testName) => {
    toast.success(`Secure, password-protected link generated for sharing ${testName} results.`);
  };

  const filtered = mockReports.filter(r => 
    r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-650" /> Reports & Labs
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review diagnostic results, download official laboratory PDFs, and share transcripts securely.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by test name, laboratory name, or diagnosis results..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800"
          />
        </div>
        <div className="flex items-center justify-end px-2 text-xs font-bold text-slate-500">
          Showing {filtered.length} Lab Records
        </div>
      </div>

      {/* Grid of Reports */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Reports Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adapting your search terms or verify with your physician.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rep) => (
            <div key={rep.id} className="premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-650 rounded-xl border border-blue-100/30">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{rep.testName}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{rep.laboratory} &bull; {rep.date}</span>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {rep.status}
                  </span>
                </div>

                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Evaluation / Interpretation</span>
                  <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">{rep.diagnosis}</p>
                </div>

                <div className="mt-3.5 text-[10px] text-slate-450 font-semibold">
                  Prescribed By: <strong className="text-slate-700 font-bold">Dr. {rep.doctorName}</strong>
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => handleDownload(rep.testName)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-105 border border-blue-200 text-blue-700 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Report PDF
                </button>
                <button 
                  onClick={() => handleShare(rep.testName)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-250 text-slate-600 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Secure Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PatientReports;
