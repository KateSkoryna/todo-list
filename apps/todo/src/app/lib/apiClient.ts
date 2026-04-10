import axios from 'axios';
import { environment } from '../../environments/environment';
import { auth } from './firebase';

const apiClient = axios.create({ baseURL: environment.apiUrl });

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
