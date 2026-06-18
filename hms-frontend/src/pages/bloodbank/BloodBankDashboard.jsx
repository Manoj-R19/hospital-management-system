import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bloodBankApi } from '../../api/bloodBankApi';
import { toast } from 'react-hot-toast';
import { 
  Heart, 
  AlertOctagon, 
  Activity, 
  Users, 
  Plus, 
  ArrowRight,
  TrendingUp, 
  Droplet,
  FileText
} from 'lucide-react';

export default function BloodBankDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    fulfilledRequests: 0,
    activeDonors: 0,
    lowStockCount: 0
  });
  const [stock, setStock] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, stockRes, reqsRes] = await Promise.all([
        bloodBankApi.getStats(),
        bloodBankApi.getStock(),
        bloodBankApi.getAllRequests()
      ]);
      setStats(statsRes.data);
      setStock(stockRes.data);
      setRequests(reqsRes.data.slice(-5).reverse());
    } catch (error) {
      toast.error('Failed to load blood bank metrics');
    } finally {
      setLoading(false);
    }
  };

  const getRolePrefix = () => {
    const path = window.location.pathname;
    return path.startsWith('/admin') ? '/admin' : '/doctor';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-l-4 border-l-rose-500' },
    { label: 'Pending Alert Requests', value: stats.pendingRequests, icon: AlertOctagon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-4 border-l-amber-500' },
    { label: 'Emergency Fulfilled', value: stats.fulfilledRequests, icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-4 border-l-emerald-500' },
    { label: 'Available Donors', value: stats.activeDonors, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-4 border-l-blue-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-2">
            <Droplet className="w-8 h-8 text-red-600 animate-pulse shrink-0" />
            Emergency Blood Bank Module
          </h1>
          <p className="text-slate-500 mt-1">Monitor blood inventory, local matches, and notify volunteer donors instantly</p>
        </div>
      </div>

      {/* Emergency Alert Bar if low stock exists */}
      {stats.lowStockCount > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm font-bold">
            Attention: {stats.lowStockCount} blood groups are currently running below critical stock thresholds. Immediate supply run or donor outreach advised.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between ${card.border}`}>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-display font-extrabold text-slate-800">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-rose-600" />
          Blood Bank Controller Operations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate(`${getRolePrefix()}/blood-bank/requests`)} 
            className="flex items-center justify-center gap-2 p-3.5 bg-red-650 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-600/10"
          >
            <Plus size={16} /> Create Emergency Request
          </button>
          <button 
            onClick={() => navigate(`${getRolePrefix()}/blood-bank/stock`)} 
            className="flex items-center justify-center gap-2 p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all"
          >
            <Droplet size={16} className="text-red-500" /> Manage Blood Stock
          </button>
          <button 
            onClick={() => navigate(`${getRolePrefix()}/blood-bank/donors`)} 
            className="flex items-center justify-center gap-2 p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl border border-blue-100 transition-all"
          >
            <Users size={16} /> Register Volunteer Donor
          </button>
        </div>
      </div>

      {/* Main Grid: Inventory & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inventory Progress Bars */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            Live Blood Inventory
          </h3>
          <div className="space-y-4 flex-1">
            {stock.map((item) => {
              const total = parseFloat(item.unitsAvailable);
              const low = parseFloat(item.lowStockThreshold);
              const percentage = Math.min((total / 30) * 100, 100);
              const isLow = total < low;

              return (
                <div key={item.id} className="space-y-1 text-sm">
                  <div className="flex justify-between items-center font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isLow ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`} />
                      {item.bloodGroup}
                    </span>
                    <span className="text-xs">
                      {total} units <span className="text-slate-400">({item.unitsReserved} res)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-550 ${
                        isLow ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Requests List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-slate-800">Recent Emergency Blood Requests</h3>
            <button 
              onClick={() => navigate(`${getRolePrefix()}/blood-bank/requests`)} 
              className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              View Matches & Alerts <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-150">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Needed Group</th>
                  <th className="px-4 py-3">Hospital / Address</th>
                  <th className="px-4 py-3">Required</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold font-display text-sm">
                        <Droplet size={14} /> {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{req.hospitalName}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{req.hospitalAddress}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{req.unitsRequired} units</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold
                        ${req.urgencyLevel === 'EMERGENCY' ? 'bg-red-100 text-red-800' : ''}
                        ${req.urgencyLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' : ''}
                        ${req.urgencyLevel === 'MEDIUM' ? 'bg-blue-100 text-blue-800' : ''}
                        ${req.urgencyLevel === 'LOW' ? 'bg-slate-100 text-slate-800' : ''}
                      `}>
                        {req.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : ''}
                        ${req.status === 'MATCHING' ? 'bg-blue-100 text-blue-800' : ''}
                        ${req.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : ''}
                      `}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">No emergency blood requests created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
