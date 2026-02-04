import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://nodejs-hw-04-kahe.onrender.com',
  withCredentials: true,
});
