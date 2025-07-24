// frontend/src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Company } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'loading' | 'idle';
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = 'idle';
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
    setAuthIdle: (state) => {
      state.status = 'idle';
    },
    setCompany: (state, action: PayloadAction<Company | null>) => {
      if (state.user) {
        state.user.company = action.payload;
        if (typeof window !== 'undefined'){
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'idle';
      if (typeof window !== 'undefined'){
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
});

export const { login, logout, setAuthIdle, setCompany, setUser } = authSlice.actions;
export default authSlice.reducer;