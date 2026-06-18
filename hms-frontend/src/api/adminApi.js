import apiClient from './apiClient';

export const adminApi = {
  registerDoctor: (data) => apiClient.post('/admin/doctors/register', data),
  getAllDoctors: () => apiClient.get('/admin/doctors'),
  getDoctorById: (id) => apiClient.get(`/admin/doctors/${id}`),
  verifyDoctor: (id) => apiClient.put(`/admin/doctors/${id}/verify`),
  blacklistDoctor: (id, blacklist) => apiClient.put(`/admin/doctors/${id}/blacklist`, { blacklist }),
  removeDoctor: (id) => apiClient.delete(`/admin/doctors/${id}`),
  getAllPatients: () => apiClient.get('/admin/patients'),
  updatePatient: (id, data) => apiClient.put(`/admin/patients/${id}`, data),
  getPatientHistory: (aadhaar) => apiClient.get(`/admin/patients/${aadhaar}/history`),
  updateDoctor: (id, data) => apiClient.put(`/admin/doctors/${id}`, data),
  getAllAppointments: () => apiClient.get('/admin/appointments'),
  createAppointment: (data) => apiClient.post('/admin/appointments', data),
  updateAppointmentStatus: (id, data) => apiClient.put(`/admin/appointments/${id}/status`, data),
  getAllInvoices: () => apiClient.get('/admin/billing'),
  createInvoice: (data) => apiClient.post('/admin/billing', data),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
};
