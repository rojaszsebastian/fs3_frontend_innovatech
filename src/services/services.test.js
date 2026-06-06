import { bffApi } from '../api/dashboardApi';
import {
  getAsignacionesPorProyecto,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacionPorProyectoYEmpleado
} from './asignacionesService';
import { getDashboardResumen } from './dashboardService';
import { getNotificaciones, marcarComoLeida } from './notificacionesService';
import {
  getProyectos,
  getProyectoById,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from './proyectosService';
import {
  getEmpleados,
  getEmpleadoById,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
} from './recursosService';

jest.mock('../api/dashboardApi', () => ({
  bffApi: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Frontend Services Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Asignaciones
  test('getAsignacionesPorProyecto', async () => {
    bffApi.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const res = await getAsignacionesPorProyecto(1);
    expect(res).toEqual([{ id: 1 }]);
    expect(bffApi.get).toHaveBeenCalledWith('/asignaciones/proyecto/1');
  });

  test('crearAsignacion', async () => {
    bffApi.post.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await crearAsignacion({ horas: 10 });
    expect(res).toEqual({ id: 1 });
  });

  test('actualizarAsignacion', async () => {
    bffApi.put.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await actualizarAsignacion(1, { horas: 10 });
    expect(res).toEqual({ id: 1 });
  });

  test('eliminarAsignacionPorProyectoYEmpleado', async () => {
    bffApi.delete.mockResolvedValueOnce({});
    await eliminarAsignacionPorProyectoYEmpleado(1, 2);
    expect(bffApi.delete).toHaveBeenCalledWith('/asignaciones/proyecto/1/empleado/2');
  });

  // Dashboard
  test('getDashboardResumen', async () => {
    bffApi.get.mockResolvedValueOnce({ data: { info: 'ok' } });
    const res = await getDashboardResumen(1, 2);
    expect(res).toEqual({ info: 'ok' });
  });

  // Notificaciones
  test('getNotificaciones', async () => {
    bffApi.get.mockResolvedValueOnce({ data: [] });
    const res = await getNotificaciones();
    expect(res).toEqual([]);
  });

  test('marcarComoLeida', async () => {
    bffApi.put.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await marcarComoLeida(1);
    expect(res).toEqual({ id: 1 });
  });

  // Proyectos
  test('getProyectos', async () => {
    bffApi.get.mockResolvedValueOnce({ data: [] });
    const res = await getProyectos();
    expect(res).toEqual([]);
  });

  test('getProyectoById', async () => {
    bffApi.get.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await getProyectoById(1);
    expect(res).toEqual({ id: 1 });
  });

  test('crearProyecto', async () => {
    bffApi.post.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await crearProyecto({});
    expect(res).toEqual({ id: 1 });
  });

  test('actualizarProyecto', async () => {
    bffApi.put.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await actualizarProyecto(1, {});
    expect(res).toEqual({ id: 1 });
  });

  test('eliminarProyecto', async () => {
    bffApi.delete.mockResolvedValueOnce({});
    await eliminarProyecto(1);
    expect(bffApi.delete).toHaveBeenCalledWith('/proyectos/1');
  });

  // Recursos
  test('getEmpleados', async () => {
    bffApi.get.mockResolvedValueOnce({ data: [] });
    const res = await getEmpleados();
    expect(res).toEqual([]);
  });

  test('getEmpleadoById', async () => {
    bffApi.get.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await getEmpleadoById(1);
    expect(res).toEqual({ id: 1 });
  });

  test('crearEmpleado', async () => {
    bffApi.post.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await crearEmpleado({});
    expect(res).toEqual({ id: 1 });
  });

  test('actualizarEmpleado', async () => {
    bffApi.put.mockResolvedValueOnce({ data: { id: 1 } });
    const res = await actualizarEmpleado(1, {});
    expect(res).toEqual({ id: 1 });
  });

  test('eliminarEmpleado', async () => {
    bffApi.delete.mockResolvedValueOnce({});
    await eliminarEmpleado(1);
    expect(bffApi.delete).toHaveBeenCalledWith('/empleados/1');
  });
});
