import { bffApi } from '../api/dashboardApi';

export const getAsignacionesPorProyecto = async (proyectoId) => {
    try {
        const response = await bffApi.get(`/asignaciones/proyecto/${proyectoId}`);
        return response.data || [];
    } catch (error) {
        console.error(`[Service Error] Fallo al obtener asignaciones para el proyecto ${proyectoId}:`, error.message);
        throw error;
    }
};

export const crearAsignacion = async (asignacion) => {
    try {
        const response = await bffApi.post('/asignaciones', asignacion);
        return response.data;
    } catch (error) {
        console.error('[Service Error] Fallo al crear asignación:', error.message);
        throw error;
    }
};

export const actualizarAsignacion = async (id, asignacion) => {
    try {
        const response = await bffApi.put(`/asignaciones/${id}`, asignacion);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al actualizar asignación con ID ${id}:`, error.message);
        throw error;
    }
};

export const eliminarAsignacionPorProyectoYEmpleado = async (proyectoId, empleadoId) => {
    try {
        await bffApi.delete(`/asignaciones/proyecto/${proyectoId}/empleado/${empleadoId}`);
    } catch (error) {
        console.error(`[Service Error] Fallo al eliminar asignación de proyecto ${proyectoId} para empleado ${empleadoId}:`, error.message);
        throw error;
    }
};
