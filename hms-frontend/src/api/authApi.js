import apiClient from './apiClient';

export const authApi = {
  adminLogin: (data) => apiClient.post('/auth/admin/login', data),
  doctorLogin: (data) => apiClient.post('/auth/doctor/login', data),
  patientLogin: (data) => apiClient.post('/auth/patient/login', data),
  registerPatient: (data) => apiClient.post('/auth/patient/register', data),
  registerAdmin: (data) => apiClient.post('/auth/admin/register', data),
  registerDoctor: (data) => apiClient.post('/doctor-registration/register', data),
};
