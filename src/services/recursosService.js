import { bffApi } from '../api/dashboardApi';

export const getEmpleados = async () => {
    try {
        const response = await bffApi.get('/empleados');
        return response.data || [];
    } catch (error) {
        console.error('[Service Error] Fallo al obtener empleados:', error.message);
        throw error;
    }
};

export const getEmpleadoById = async (id) => {
    try {
        const response = await bffApi.get(`/empleados/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al obtener empleado con ID ${id}:`, error.message);
        throw error;
    }
};

export const crearEmpleado = async (empleado) => {
    try {
        const response = await bffApi.post('/empleados', empleado);
        return response.data;
    } catch (error) {
        console.error('[Service Error] Fallo al crear empleado:', error.message);
        throw error;
    }
};

export const actualizarEmpleado = async (id, empleado) => {
    try {
        const response = await bffApi.put(`/empleados/${id}`, empleado);
        return response.data;
    } catch (error) {
        console.error(`[Service Error] Fallo al actualizar empleado con ID ${id}:`, error.message);
        throw error;
    }
};

export const eliminarEmpleado = async (id) => {
    try {
        await bffApi.delete(`/empleados/${id}`);
    } catch (error) {
        console.error(`[Service Error] Fallo al eliminar empleado con ID ${id}:`, error.message);
        throw error;
    }
};
