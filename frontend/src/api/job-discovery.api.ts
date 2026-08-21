import { api } from './client';

export const jobDiscoveryApi = {
  search: (roleName?: string) =>
    api.post('/job-discovery/search', null, { params: roleName ? { roleName } : {} }).then((r) => r.data),
  getFeed: () => api.get('/job-discovery/feed').then((r) => r.data),
};
