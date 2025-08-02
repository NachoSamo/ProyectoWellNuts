import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:6002/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para incluir el token en todas las solicitudes
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
