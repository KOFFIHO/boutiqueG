// src/utils/auth.js
import axios from 'axios';

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete axios.defaults.headers.common['Authorization'];
}
