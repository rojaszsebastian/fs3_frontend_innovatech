import { bffApi } from '../api/dashboardApi';

export const getProyectos = async () => {
    try {
        const response = await bffApi.get('/proyectos');
        return response.data || [];
    } catch (error) {
        console.error('[Service Error] Fallo al obtener proyectos:', error.message);
        throw error;
    }
};

export const getProyectoById = async (id) => {
    try {
        const response = await bffApi.get(`/proyectos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al obtener proyecto con ID ${id}:`, error.message);
        throw error;
    }
};

export const crearProyecto = async (proyecto) => {
    try {
        const response = await bffApi.post('/proyectos', proyecto);
        return response.data;
    } catch (error) {
        console.error('[Service Error] Fallo al crear proyecto:', error.message);
        throw error;
    }
};

export const actualizarProyecto = async (id, proyecto) => {
    try {
        const response = await bffApi.put(`/proyectos/${id}`, proyecto);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al actualizar proyecto con ID ${id}:`, error.message);
        throw error;
    }
};

export const eliminarProyecto = async (id) => {
    try {
        await bffApi.delete(`/proyectos/${id}`);
    } catch (error) {
        console.error(`[Service Error] Fallo al eliminar proyecto con ID ${id}:`, error.message);
        throw error;
    }
};
