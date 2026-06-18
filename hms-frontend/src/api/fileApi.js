import apiClient from './apiClient';

export const fileApi = {
  uploadReport: (file, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return apiClient.post('/files/upload/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getReportDownloadUrl: (id) => `${apiClient.defaults.baseURL}/files/reports/${id}`,
};
