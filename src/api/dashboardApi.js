import axios from 'axios';

const BFF_API_URL = 'http://localhost:8080/api';

export const bffApi = axios.create({
    baseURL: BFF_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});