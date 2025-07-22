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
  // Reducers adalah fungsi yang mengubah state
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Di dunia nyata, Anda mungkin akan menyimpan token di httpOnly cookie
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Ekspor actions agar bisa digunakan di komponen lain
export const { login, logout } = authSlice.actions;

// Ekspor reducer untuk digabungkan di store utama
export default authSlice.reducer;