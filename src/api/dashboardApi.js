import axios from 'axios';

const BFF_API_URL = 'http://127.0.0.1:8080/api';

export const bffApi = axios.create({
    baseURL: BFF_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

bffApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('[API] Tiempo de espera agotado (Timeout)');
        } else if (!error.response) {
            console.error('[API] Error de red: El BFF no responde o el puerto 8080 está cerrado');
        } else {
            console.error(`[API] Error ${error.response.status}:`, error.response.data);
        }
        return Promise.reject(error);
    }
);