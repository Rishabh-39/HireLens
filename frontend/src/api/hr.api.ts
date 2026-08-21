import { api } from './client';

export const hrApi = {
  listCandidates: (params: { skill?: string; role?: string; page?: number; limit?: number }) =>
    api.get('/hr/candidates', { params }).then((r) => r.data),
  getCandidate: (id: string) => api.get(`/hr/candidates/${id}`).then((r) => r.data),
  sendMessage: (data: { candidateId: string; message: string }) =>
    api.post('/hr/messages', data).then((r) => r.data),
  getSentMessages: (candidateId: string) =>
    api.get(`/hr/messages/${candidateId}`).then((r) => r.data),
  getInbox: () => api.get('/hr/inbox/me').then((r) => r.data),
};
