import { create } from 'zustand';

export const useReminderStore = create((set) => ({
  dueReminders: [],
  setDueReminders: (reminders) => set({ dueReminders: reminders }),
  clearDueReminder: (id) =>
    set((state) => ({
      dueReminders: state.dueReminders.filter((r) => r.id !== id),
    })),
}));
