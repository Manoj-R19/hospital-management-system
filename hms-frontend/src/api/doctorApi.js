import apiClient from './apiClient';

export const doctorApi = {
  getProfile: () => apiClient.get('/doctor/profile'),
  getPatientBasicInfo: (aadhaar) => apiClient.get(`/doctor/patient/${aadhaar}/basic`),
  getPatientHistory: (aadhaar) => apiClient.get(`/doctor/patient/${aadhaar}/history`),
  createEncounter: (data) => apiClient.post('/doctor/encounters', data),
  getPrescriptionsForEncounter: (encounterId) => apiClient.get(`/doctor/prescriptions/${encounterId}`),
  getStats: () => apiClient.get('/doctor/stats'),
  getAppointments: () => apiClient.get('/doctor/appointments'),
  updateAppointmentStatus: (id, data) => apiClient.put(`/doctor/appointments/${id}/status`, data),
  updateAvailability: (data) => apiClient.put('/doctor/availability', data),
};

