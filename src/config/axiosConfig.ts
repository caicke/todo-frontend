import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('MY_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('REFRESH_TOKEN');
                console.log(refreshToken);
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, { refresh_token: refreshToken });

                console.log(response);

                const newAccessToken = response.data.access_token;
                localStorage.setItem('MY_TOKEN', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('MY_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                toast.error('Session expired. Please log in again.');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;