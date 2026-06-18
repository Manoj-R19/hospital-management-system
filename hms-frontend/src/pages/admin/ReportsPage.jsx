import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity, 
  Download, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');

  const handleExport = () => {
    toast.success('Clinical & Financial report PDF downloaded!');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Analytics data re-synchronized.');
    }, 800);
  };

  // Mock revenue chart data (out of 100 for SVG height scale)
  const monthlyRevenue = [
    { label: 'Jan', value: 120000, height: 35 },
    { label: 'Feb', value: 180000, height: 45 },
    { label: 'Mar', value: 240000, height: 60 },
    { label: 'Apr', value: 210000, height: 50 },
    { label: 'May', value: 310000, height: 85 },
    { label: 'Jun', value: 350000, height: 95 },
  ];

  const departmentUsage = [
    { name: 'Cardiology', count: 145, percentage: 35, color: 'bg-blue-500' },
    { name: 'Neurology', count: 98, percentage: 24, color: 'bg-indigo-500' },
    { name: 'Orthopedics', count: 82, percentage: 20, color: 'bg-teal-500' },
    { name: 'Pediatrics', count: 54, percentage: 13, color: 'bg-amber-500' },
    { name: 'Dermatology', count: 33, percentage: 8, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Audit operational efficiency, outpatient flow, and revenue lines</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold text-slate-600 text-sm"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={handleRefresh}
            className="p-2.5 text-slate-500 border border-slate-250 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Grid of charts & details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Performance Chart (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Monthly Revenue Stream</h3>
              <p className="text-xs text-slate-400 mt-0.5">Billing figures collected across clinical divisions</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
              <p className="text-xl font-display font-extrabold text-emerald-600 mt-0.5">₹1,410,000</p>
            </div>
          </div>

          {/* SVG/HTML Chart representation */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-200 relative">
            {/* Grid line markers */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 pointer-events-none"></div>

            {monthlyRevenue.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10 group cursor-pointer">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  ₹{item.value.toLocaleString()}
                </div>
                {/* Bar */}
                <div 
                  style={{ height: `${item.height}%` }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-300 shadow-sm"
                />
                <span className="text-xs text-slate-400 font-semibold mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Usage (Right 1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800">Department-wise Workload</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of clinical visit encounters</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center text-sm">
            {departmentUsage.map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="text-slate-400 font-semibold">{dept.count} cases ({dept.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${dept.percentage}%` }}
                    className={`h-full rounded-full ${dept.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient trends & operational stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Outpatient Trends</h4>
              <p className="text-[10px] text-slate-400">Weekly patient checkup registrations</p>
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-800">412</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} /> +12.4% vs last week
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Bed Occupancy rate</h4>
              <p className="text-[10px] text-slate-400">Emergency & inpatient unit usage</p>
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-800">76.8%</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} /> +4.2% vs last week
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Average Wait Time</h4>
              <p className="text-[10px] text-slate-400">Outpatient checkin delay</p>
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-800">14 mins</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} /> -3.5 mins (Efficiency gain)
          </span>
        </div>
      </div>
    </div>
  );
}
