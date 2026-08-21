import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../api/auth.api';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('jb_user') || 'null'),
  accessToken: localStorage.getItem('jb_access_token'),
  refreshToken: localStorage.getItem('jb_refresh_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('jb_user', JSON.stringify(action.payload.user));
      localStorage.setItem('jb_access_token', action.payload.accessToken);
      localStorage.setItem('jb_refresh_token', action.payload.refreshToken);
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('jb_access_token', action.payload.accessToken);
      localStorage.setItem('jb_refresh_token', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('jb_user');
      localStorage.removeItem('jb_access_token');
      localStorage.removeItem('jb_refresh_token');
    },
  },
});

export const { setCredentials, setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
