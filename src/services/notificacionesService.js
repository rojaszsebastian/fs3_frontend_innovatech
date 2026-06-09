import { bffApi } from '../api/dashboardApi';

export const getNotificaciones = async () => {
    try {
        const response = await bffApi.get('/notificaciones');
        return response.data || [];
    } catch (error) {
        console.error('[Service Error] Fallo al obtener notificaciones:', error.message);
        throw error;
    }
};

export const marcarComoLeida = async (id) => {
    try {
        const response = await bffApi.put(`/notificaciones/${id}/leer`);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al marcar como leída la notificación con ID ${id}:`, error.message);
        throw error;
    }
};
