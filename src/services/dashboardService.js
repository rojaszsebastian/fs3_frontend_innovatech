import { bffApi } from '../api/dashboardApi';

export const getDashboardResumen = async (proyectoId, recursoId) => {
    try {
        const response = await bffApi.get(`/dashboard/resumen`, {
            params: { proyectoId, recursoId }
        });
        return response.data;
    } catch (error) {
        console.error("Error al conectar con el BFF:", error);
        throw error;
    }
};