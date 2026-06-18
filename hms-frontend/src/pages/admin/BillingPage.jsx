import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { 
  Receipt, 
  Plus, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Printer, 
  Search, 
  X,
  FileDown,
  Building
} from 'lucide-react';

export default function BillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form state
  const [createForm, setCreateForm] = useState({
    patientId: '',
    amount: '',
    dueAmount: '',
    paymentStatus: 'UNPAID'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, patsRes] = await Promise.all([
        adminApi.getAllInvoices(),
        adminApi.getAllPatients()
      ]);
      setInvoices(invRes.data);
      setPatients(patsRes.data);
    } catch (error) {
      toast.error('Failed to load billing registry');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createInvoice({
        patientId: createForm.patientId,
        amount: parseFloat(createForm.amount),
        dueAmount: parseFloat(createForm.dueForm || createForm.dueAmount || 0),
        paymentStatus: createForm.paymentStatus
      });
      toast.success('Invoice generated successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({ patientId: '', amount: '', dueAmount: '', paymentStatus: 'UNPAID' });
      fetchData();
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const revenueCollected = invoices.filter(inv => inv.paymentStatus === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
  const outstandingDue = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.patient?.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Billing Desk</h1>
          <p className="text-slate-500 mt-1">Manage hospital accounts, invoices, due outstanding bills, and patient receipts</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          <Plus size={16} /> Generate Invoice
        </button>
      </div>

      {/* Finance Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Invoiced</p>
            <p className="text-3xl font-display font-extrabold text-slate-800 mt-1">₹{totalInvoiced.toLocaleString()}</p>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600">
            <Receipt size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Revenue Collected</p>
            <p className="text-3xl font-display font-extrabold text-slate-800 mt-1">₹{revenueCollected.toLocaleString()}</p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Outstanding Dues</p>
            <p className="text-3xl font-display font-extrabold text-slate-800 mt-1">₹{outstandingDue.toLocaleString()}</p>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by invoice number or patient name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-400 text-left text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice No.</th>
                <th className="px-6 py-4">Patient Details</th>
                <th className="px-6 py-4">Billing Date</th>
                <th className="px-6 py-4">Amount Charged</th>
                <th className="px-6 py-4">Due Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{inv.patient?.fullName}</div>
                    <div className="text-xs text-slate-400">Phone: {inv.patient?.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{inv.billingDate}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {inv.dueAmount > 0 ? (
                      <span className="text-amber-600 font-bold">₹{inv.dueAmount.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 font-semibold">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${inv.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : ''}
                      ${inv.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-800 border border-amber-200' : ''}
                      ${inv.paymentStatus === 'UNPAID' ? 'bg-rose-100 text-rose-800 border border-rose-200' : ''}
                    `}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all border border-blue-100 flex items-center gap-1.5 ml-auto"
                    >
                      <Printer size={13} /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Receipt size={40} className="text-slate-300 mb-3" />
                      <p className="font-semibold text-slate-700">No invoices generated yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-md overflow-hidden relative flex flex-col">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Generate Hospital Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Select Patient</label>
                <select 
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Insured or Admitted Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} (Phone: {p.phoneNumber})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Charged Amount (₹)</label>
                  <input 
                    type="number"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Due Outstanding (₹)</label>
                  <input 
                    type="number"
                    value={createForm.dueAmount}
                    onChange={(e) => setCreateForm({ ...createForm, dueAmount: e.target.value })}
                    placeholder="e.g. 0 or 1500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Payment Status</label>
                <select 
                  value={createForm.paymentStatus}
                  onChange={(e) => setCreateForm({ ...createForm, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-600/10">
                  Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)} />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50 print:hidden">
              <h3 className="font-bold text-slate-800 text-lg">Hospital Invoice Details</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1 text-sm bg-white" id="printable-receipt-container">
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                    <Building size={20} />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-slate-950 text-xl tracking-tight">CureWell General</h2>
                    <p className="text-[11px] text-slate-400">Hospital License: LIC-2026-00001</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">RECEIPT</p>
                  <p className="font-mono font-bold text-slate-700 mt-1">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>

              {/* Patient Details Row */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedInvoice.patient?.fullName}</p>
                  <p className="text-slate-500 mt-0.5">Phone: {selectedInvoice.patient?.phoneNumber}</p>
                  <p className="text-slate-500">Address: {selectedInvoice.patient?.address || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Billing Details</p>
                  <p className="text-slate-500">Date: {selectedInvoice.billingDate}</p>
                  <p className="text-slate-500">Aadhaar last 4: {selectedInvoice.patient?.aadhaarLast4}</p>
                  <p className="text-slate-500">Insurance Provider: {selectedInvoice.patient?.insuranceProvider || 'None'}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 text-left text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    <tr>
                      <td className="px-4 py-4 font-bold text-slate-800">Hospitalization & General Consultations</td>
                      <td className="px-4 py-4 text-right font-bold text-slate-800">₹{selectedInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Bottom */}
              <div className="border-t border-slate-200 pt-6 flex justify-between items-start">
                <div className="max-w-xs text-xs text-slate-400 leading-relaxed italic">
                  * This is a computer generated invoice and does not require signature. Thank you for choosing CureWell General.
                </div>
                <div className="w-56 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (0%):</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-900 font-bold text-sm">
                    <span>Total Charge:</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-600 font-bold">
                    <span>Due Outstanding:</span>
                    <span>₹{selectedInvoice.dueAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-200 pt-2">
                    <span>Payment Status:</span>
                    <span>{selectedInvoice.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Modal Print Trigger */}
              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/10"
                >
                  <Printer size={16} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
