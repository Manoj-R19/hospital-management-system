import { useEffect, useState } from 'react';
import { bloodBankApi } from '../../api/bloodBankApi';
import { toast } from 'react-hot-toast';
import { 
  Droplet, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Edit2, 
  Activity,
  Plus
} from 'lucide-react';

export default function StockManagementPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    unitsAvailable: '',
    unitsReserved: ''
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await bloodBankApi.getStock();
      setStock(res.data);
    } catch (err) {
      toast.error('Failed to load blood stock details');
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (item) => {
    setSelectedGroup(item);
    setAdjustForm({
      unitsAvailable: item.unitsAvailable.toString(),
      unitsReserved: item.unitsReserved.toString()
    });
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    try {
      await bloodBankApi.adjustStock({
        bloodGroup: selectedGroup.bloodGroup,
        unitsAvailable: parseFloat(adjustForm.unitsAvailable),
        unitsReserved: parseFloat(adjustForm.unitsReserved)
      });
      toast.success(`Inventory adjusted for blood group ${selectedGroup.bloodGroup}`);
      setIsAdjustModalOpen(false);
      fetchStock();
    } catch (err) {
      toast.error('Failed to adjust stock units');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800">Blood Stock Directory</h1>
        <p className="text-slate-500 mt-1">Audit, adjust, and monitor clinical reserves, reservations, and alerts</p>
      </div>

      {/* Grid of blood types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stock.map((item) => {
          const available = parseFloat(item.unitsAvailable);
          const threshold = parseFloat(item.lowStockThreshold);
          const isLow = available < threshold;

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="w-12 h-12 rounded-2xl bg-red-50 text-red-650 border border-red-150 font-black font-display text-xl flex items-center justify-center">
                  {item.bloodGroup}
                </span>
                
                {isLow ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                    <AlertTriangle size={12} /> Low Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle size={12} /> Healthy
                  </span>
                )}
              </div>

              <div className="my-6 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Available:</span>
                  <span className="font-bold text-slate-800">{available} Units</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Reserved:</span>
                  <span className="font-semibold text-slate-600">{item.unitsReserved} Units</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Low Alert Trigger:</span>
                  <span>{item.lowStockThreshold} Units</span>
                </div>
              </div>

              <button 
                onClick={() => openAdjustModal(item)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                <Edit2 size={12} /> Adjust Units
              </button>
            </div>
          );
        })}
      </div>

      {/* Adjust Inventory Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-sm overflow-hidden relative flex flex-col">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Droplet className="text-red-600" /> Adjust Stock: {selectedGroup?.bloodGroup}
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-slate-550 font-bold mb-1">Available Units</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={adjustForm.unitsAvailable}
                  onChange={(e) => setAdjustForm({ ...adjustForm, unitsAvailable: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-555 font-bold mb-1">Reserved Units</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={adjustForm.unitsReserved}
                  onChange={(e) => setAdjustForm({ ...adjustForm, unitsReserved: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md shadow-red-600/10">
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
