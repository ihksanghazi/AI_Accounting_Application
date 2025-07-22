import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Mengambil URL backend dari .env
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;