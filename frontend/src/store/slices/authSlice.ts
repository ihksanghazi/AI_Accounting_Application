import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definisikan tipe untuk data user dan state
interface User {
  ID: number;
  Name: string;
  Email: string;
  // Tambahkan Company jika ada
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Nilai awal state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
  },
});

// Ekspor actions agar bisa digunakan di komponen lain
export const { login, logout } = authSlice.actions;

// Ekspor reducer untuk digabungkan di store utama
export default authSlice.reducer;