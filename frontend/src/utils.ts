import axios from 'axios';
import { BaseURL } from './constants';
export const saveTokeninLocalStorage = (token: string) => {
    if (!token) return;
    localStorage.setItem('accessToken', token);
    return;
}


const axiosInstance = axios.create({
    baseURL: BaseURL, 
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;