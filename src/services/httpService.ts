import axios from 'axios';

import { API_URL } from '@/configs/global';

const app = axios.create({ baseURL: API_URL, withCredentials: true });

app.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

app.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default app;
