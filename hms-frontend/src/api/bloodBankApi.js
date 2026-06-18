import apiClient from './apiClient';

export const bloodBankApi = {
  getStats: () => apiClient.get('/blood-bank/stats'),
  getStock: () => apiClient.get('/blood-bank/stock'),
  adjustStock: (data) => apiClient.post('/blood-bank/stock/adjust', data),
  getAllDonors: () => apiClient.get('/blood-bank/donors'),
  registerDonor: (data) => apiClient.post('/blood-bank/donors', data),
  getAllRequests: () => apiClient.get('/blood-bank/requests'),
  createRequest: (data) => apiClient.post('/blood-bank/requests', data),
  getMatches: (id) => apiClient.get(`/blood-bank/requests/${id}/matches`),
  notifyDonors: (id) => apiClient.post(`/blood-bank/requests/${id}/notify`),
  updateMatchStatus: (id, status) => apiClient.put(`/blood-bank/matches/${id}/status`, { status }),
  updateRequestStatus: (id, status) => apiClient.put(`/blood-bank/requests/${id}/status`, { status }),
};
