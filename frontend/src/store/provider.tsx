// frontend/src/store/provider.tsx
"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { login, setAuthIdle } from './slices/authSlice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('user');

    if (token && userDataString && userDataString !== 'undefined' && userDataString !== 'null') {
      try {
        const userData = JSON.parse(userDataString);
        if (userData && typeof userData === 'object') {
          store.dispatch(login({ token, user: userData }));
        } else {
          localStorage.clear();
          store.dispatch(setAuthIdle());
        }
      } catch (error) {
        console.error("Gagal memproses data localStorage, membersihkan...", error);
        localStorage.clear();
        store.dispatch(setAuthIdle());
      }
    } else {
      store.dispatch(setAuthIdle());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>
}