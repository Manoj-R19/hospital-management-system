import { useReminderStore } from '../../store/reminderStore';
import { patientApi } from '../../api/patientApi';
import { toast } from 'react-hot-toast';

const ReminderNotification = () => {
  const dueReminders = useReminderStore((state) => state.dueReminders);
  const clearDueReminder = useReminderStore((state) => state.clearDueReminder);

  if (!dueReminders || dueReminders.length === 0) return null;

  const handleAction = async (id, status) => {
    try {
      await patientApi.markReminderStatus(id, { status });
      toast.success(`Marked as ${status}`);
      clearDueReminder(id);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {dueReminders.map((reminder) => (
        <div key={reminder.id} className="bg-white border-l-4 border-brand-500 shadow-lg rounded p-4 w-80">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-800">Time for Medicine</h4>
            <span className="text-sm font-medium text-brand-600">{reminder.reminderTime}</span>
          </div>
          <p className="text-gray-700 mb-1">{reminder.medicineName}</p>
          <p className="text-gray-500 text-sm mb-3">Dosage: {reminder.dosage}</p>
          
          <div className="flex space-x-2">
            <button onClick={() => handleAction(reminder.id, 'TAKEN')} className="flex-1 bg-green-500 text-white text-sm py-1 rounded hover:bg-green-600">Taken</button>
            <button onClick={() => handleAction(reminder.id, 'SKIPPED')} className="flex-1 bg-gray-200 text-gray-700 text-sm py-1 rounded hover:bg-gray-300">Skip</button>
            <button onClick={() => clearDueReminder(reminder.id)} className="flex-1 border border-gray-300 text-gray-700 text-sm py-1 rounded hover:bg-gray-50">Close</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderNotification;
