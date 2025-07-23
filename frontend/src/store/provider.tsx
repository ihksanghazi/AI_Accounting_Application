// frontend/src/store/provider.tsx
"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { login, setAuthIdle } from './slices/authSlice'; // <-- Pastikan import ini benar

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('user');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        store.dispatch(login({ token, user: userData }));
      } catch (error) {
        console.error("Gagal parse user data", error);
        localStorage.clear();
        store.dispatch(setAuthIdle());
      }
    } else {
      store.dispatch(setAuthIdle());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>
}