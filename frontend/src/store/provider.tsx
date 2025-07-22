"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { login } from './slices/authSlice';

export function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {

    useEffect(()=>{
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
        // Jika ada data di localStorage, dispatch action 'login'
        // untuk mengisi kembali state Redux
        store.dispatch(login({ token, user: JSON.parse(userData) }));
        }
    },[])

  return <Provider store={store}>{children}</Provider>
}