import apiClient from './apiClient';

export const patientApi = {
  getProfile: () => apiClient.get('/patient/profile'),
  getActivePrescriptions: () => apiClient.get('/patient/prescriptions/active'),
  setReminder: (data) => apiClient.post('/patient/reminders', data),
  getActiveReminders: () => apiClient.get('/patient/reminders'),
  getTodayReminders: () => apiClient.get('/patient/reminders/today'),
  markReminderStatus: (id, statusData) => apiClient.patch(`/patient/reminders/${id}/status`, statusData),
  getAppointments: () => apiClient.get('/patient/appointments'),
  rescheduleAppointment: (id, data) => apiClient.put(`/patient/appointments/${id}/reschedule`, data),
};

