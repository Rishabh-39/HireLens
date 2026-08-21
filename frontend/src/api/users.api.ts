import { api } from './client';

export const usersApi = {
  getMe: () => api.get('/users/me').then((r) => r.data),
  updateMe: (data: { name?: string }) => api.patch('/users/me', data).then((r) => r.data),
  setJobPreferences: (roles: string[]) =>
    api.post('/users/me/job-preferences', { roles }).then((r) => r.data),
};
