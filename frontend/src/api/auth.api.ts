import { api } from './client';

export type Role = 'CANDIDATE' | 'HR';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  registerCandidate: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/candidate/register', data).then((r) => r.data),

  loginCandidate: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/candidate/login', data).then((r) => r.data),

  registerHr: (data: { name: string; email: string; password: string; company: string }) =>
    api.post<AuthResponse>('/auth/hr/register', data).then((r) => r.data),

  loginHr: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/hr/login', data).then((r) => r.data),

  logout: () => api.post('/auth/logout'),
};
