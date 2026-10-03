import axios from 'axios';

import { API_URL } from '@/configs/global';

const app = axios.create({ baseURL: API_URL, withCredentials: true });

app.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

app.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orginalConfig = error.config;
    if (error.response.status === 401 && !orginalConfig._retry) {
      orginalConfig._retry = true;

      try {
        const { data } = await axios.get(`${API_URL}/auth/refresh-token`, {
          withCredentials: true,
        });
        if (data) return app(orginalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default app;
