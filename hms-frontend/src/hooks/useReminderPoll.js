import { useEffect } from 'react';
import { patientApi } from '../api/patientApi';
import { useReminderStore } from '../store/reminderStore';

export const useReminderPoll = () => {
  const setDueReminders = useReminderStore((state) => state.setDueReminders);

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const res = await patientApi.getTodayReminders();
        const reminders = res.data;
        const now = new Date();
        
        const due = reminders.filter((r) => {
          if (!r.reminderTime) return false;
          const [h, m] = r.reminderTime.split(':');
          const reminderTime = new Date();
          reminderTime.setHours(parseInt(h), parseInt(m), 0);
          
          const diff = (now - reminderTime) / 60000; // diff in minutes
          // Within -1 to +5 minutes window
          return diff >= -1 && diff <= 5 && r.status === 'PENDING';
        });
        
        if (due.length > 0) {
          setDueReminders(due);
        }
      } catch (error) {
        console.error('Failed to poll reminders', error);
      }
    };

    const intervalId = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(intervalId);
  }, [setDueReminders]);
};
