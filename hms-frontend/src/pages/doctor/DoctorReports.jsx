import { useState } from 'react';
import { 
  BarChart3, TrendingUp, Calendar, AlertTriangle, Users, 
  ChevronRight, RefreshCw, Activity, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DoctorReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('WEEK');

  const handleExport = () => {
    toast.success('Clinical practice summary report exported as PDF');
  };

  // Mock practice analytics datasets
  const stats = {
    totalConsultations: 124,
    newPatients: 38,
    cancellations: 4,
    walkIns: 26,
    reschedules: 8,
    completionRate: '96.2%'
  };

  const dailyConsultations = [
    { day: 'Mon', count: 18, walkin: 4 },
    { day: 'Tue', count: 22, walkin: 6 },
    { day: 'Wed', count: 14, walkin: 3 },
    { day: 'Thu', count: 24, walkin: 5 },
    { day: 'Fri', count: 20, walkin: 4 },
    { day: 'Sat', count: 16, walkin: 3 },
    { day: 'Sun', count: 10, walkin: 1 }
  ];

  return (
    <div className="max-w-[1450px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-650" /> Clinical Performance & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Monitor patient inflow, track checkups, follow-up rates, and review cancellation metrics.</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={reportPeriod} 
            onChange={(e) => setReportPeriod(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
          >
            <option value="WEEK">This Week</option>
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:-translate-y-0.5"
          >
            Export Practice PDF <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Key Practice Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Consultations', val: stats.totalConsultations, change: '+12% vs last week', color: 'text-teal-600', icon: Stethoscope },
          { label: 'New Patients Registered', val: stats.newPatients, change: '+5% vs last week', color: 'text-indigo-600', icon: Users },
          { label: 'Walk-in Admissions', val: stats.walkIns, change: '+8% vs last week', color: 'text-blue-600', icon: Activity },
          { label: 'Rescheduled Requests', val: stats.reschedules, change: '-2% vs last week', color: 'text-amber-600', icon: RefreshCw },
          { label: 'Cancellations Count', val: stats.cancellations, change: '-15% vs last week', color: 'text-rose-600', icon: AlertTriangle },
          { label: 'Checkup Completion Rate', val: stats.completionRate, change: 'Optimal threshold', color: 'text-emerald-600', icon: TrendingUp }
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{c.label}</span>
              <p className="text-2xl font-extrabold text-slate-800 mt-2">{c.val}</p>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1.5">{c.change}</span>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Patient Inflow & Walk-in comparative chart */}
        <div className="premium-card-static p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-850">Patient Inflow & Walk-ins Trend</h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Daily breakdown of scheduled appointments vs walk-ins</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-teal-600">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-sm"></span> Scheduled
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Walk-ins
              </span>
            </div>
          </div>

          <div className="h-56 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Y-axis grids */}
              <line x1="45" y1="15" x2="560" y2="15" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="55" x2="560" y2="55" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="95" x2="560" y2="95" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="135" x2="560" y2="135" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="170" x2="560" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />
              
              <text x="20" y="20" className="text-[10px] font-bold fill-slate-400">25</text>
              <text x="20" y="60" className="text-[10px] font-bold fill-slate-400">18</text>
              <text x="20" y="100" className="text-[10px] font-bold fill-slate-400">12</text>
              <text x="25" y="140" className="text-[10px] font-bold fill-slate-400">6</text>
              <text x="25" y="175" className="text-[10px] font-bold fill-slate-400">0</text>

              {/* Draw stacked bars */}
              {dailyConsultations.map((d, idx) => {
                const x = 75 + idx * 68;
                const maxVal = 25;
                const totalHeight = 155;
                
                // Stack calculation
                const schedVal = d.count - d.walkin;
                const schedHeight = (schedVal / maxVal) * totalHeight;
                const walkinHeight = (d.walkin / maxVal) * totalHeight;
                
                const schedY = 170 - schedHeight;
                const walkinY = schedY - walkinHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    {/* Scheduled bar segment */}
                    <rect 
                      x={x} 
                      y={schedY} 
                      width="20" 
                      height={schedHeight} 
                      className="fill-teal-500 hover:fill-teal-600 transition-colors"
                    />
                    {/* Walk-in bar segment */}
                    <rect 
                      x={x} 
                      y={walkinY} 
                      width="20" 
                      height={walkinHeight} 
                      className="fill-blue-500 hover:fill-blue-600 transition-colors"
                    />
                    
                    {/* Hover labels */}
                    <text x={x + 10} y={walkinY - 6} textAnchor="middle" className="text-[9px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </text>

                    <text x={x + 10} y="188" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Practice Dynamics (Cancellations & Reschedules area curves) */}
        <div className="premium-card-static p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-850">Cancellation & Reschedule Timeline</h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Monitoring booking changes and practice disruption indexes</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Cancellations
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Reschedules
              </span>
            </div>
          </div>

          <div className="h-56 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Grids */}
              <line x1="45" y1="15" x2="560" y2="15" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="55" x2="560" y2="55" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="95" x2="560" y2="95" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="135" x2="560" y2="135" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="170" x2="560" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />
              
              <text x="25" y="20" className="text-[10px] font-bold fill-slate-400">5</text>
              <text x="25" y="60" className="text-[10px] font-bold fill-slate-400">4</text>
              <text x="25" y="100" className="text-[10px] font-bold fill-slate-400">3</text>
              <text x="25" y="140" className="text-[10px] font-bold fill-slate-400">2</text>
              <text x="25" y="175" className="text-[10px] font-bold fill-slate-400">0</text>

              {/* Area path for reschedules (1, 2, 0, 3, 1, 1, 0) */}
              {/* Coordinates mappings: Mon=75, Tue=143, Wed=211, Thu=279, Fri=347, Sat=415, Sun=483 */}
              {/* Y coordinates (0=170, 1=135, 2=95, 3=55, 4=15) */}
              <path 
                d="M 75,135 Q 143,95 211,170 T 279,55 T 347,135 T 415,135 T 483,170 L 483,170 L 75,170 Z"
                className="fill-amber-100/50 stroke-amber-500"
                strokeWidth="2.5"
                fillOpacity="0.4"
              />
              
              {/* Area path for cancellations (0, 0, 1, 0, 2, 1, 0) */}
              <path 
                d="M 75,170 Q 143,170 211,135 T 279,170 T 347,95 T 415,135 T 483,170 L 483,170 L 75,170 Z"
                className="fill-rose-100/50 stroke-rose-500"
                strokeWidth="2.5"
                fillOpacity="0.4"
              />

              {/* X Axis Labels */}
              {dailyConsultations.map((d, idx) => (
                <text key={idx} x={75 + idx * 68} y="188" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500">
                  {d.day}
                </text>
              ))}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorReports;
