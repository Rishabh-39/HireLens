import { api } from './client';

export type FeedbackStatus =
  | 'APPLIED'
  | 'GOT_RESPONSE'
  | 'INTERVIEW_SCHEDULED'
  | 'REJECTED'
  | 'NO_RESPONSE'
  | 'CUSTOM_COMMENT';

export const feedbackApi = {
  create: (data: { careerLinkId: string; status: FeedbackStatus; comment?: string }) =>
    api.post('/feedback', data).then((r) => r.data),
  getMine: () => api.get('/feedback/mine').then((r) => r.data),
  getByCareerLink: (careerLinkId: string, page = 1, limit = 20) =>
    api.get(`/feedback/career-link/${careerLinkId}`, { params: { page, limit } }).then((r) => r.data),
  getAll: (page = 1, limit = 20) =>
    api.get('/feedback', { params: { page, limit } }).then((r) => r.data),
};
