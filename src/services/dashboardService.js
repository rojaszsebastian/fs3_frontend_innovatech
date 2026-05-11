import { bffApi } from '../api/dashboardApi';

export const getDashboardResumen = async (proyectoId, recursoId) => {
    try {
        const response = await bffApi.get('/dashboard/resumen', {
            params: {
                proyectoId,
                recursoId
            }
        });

        if (!response.data) {
            throw new Error("Respuesta del servidor sin contenido");
        }

        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al consultar Dashboard (ID Proyecto: ${proyectoId}):`, error.message);
        throw error;
    }
};