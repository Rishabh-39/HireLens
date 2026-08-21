import { api } from './client';

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  getMine: () => api.get('/resume/me').then((r) => r.data),
  getById: (id: string) => api.get(`/resume/${id}`).then((r) => r.data),
};
