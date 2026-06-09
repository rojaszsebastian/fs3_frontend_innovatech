import React, { useState, useEffect } from 'react';
import { getDashboardResumen } from '../services/dashboardService';
import { getEmpleados } from '../services/recursosService';
import {
    getAsignacionesPorProyecto,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacionPorProyectoYEmpleado
} from '../services/asignacionesService';
import ProjectSummaryCard from '../components/proyectos/ProjectSummaryCard';
import EmployeeCapacityCard from '../components/rrhh/EmployeeCapacityCard';

import '../styles/dashboard.css';
import '../styles/navbar.css';

const DashboardPage = () => {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchIds, setSearchIds] = useState({ proyectoId: 1, recursoId: 1 });
    const [tempIds, setTempIds] = useState({ proyectoId: 1, recursoId: 1 });

    // Autocomplete states for main search
    const [allEmployees, setAllEmployees] = useState([]);
    const [employeeSearchText, setEmployeeSearchText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Project Assignments states
    const [asignaciones, setAsignaciones] = useState([]);
    const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Modal state for Assign/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
    const [assignmentForm, setAssignmentForm] = useState({
        id: '',
        empleadoId: '',
        horasAsignadas: '',
        nombreEmpleado: '',
        cargoEmpleado: ''
    });
    const [assignSearchText, setAssignSearchText] = useState('');
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getDashboardResumen(searchIds.proyectoId, searchIds.recursoId);

                setResumen({
                    project: {
                        name: data.nombreProyecto,
                        status: data.estadoProyecto,
                        totalHours: data.totalHoras
                    },
                    employee: {
                        name: data.nombreResponsable,
                        role: data.cargoResponsable,
                        capacity: data.capacidadResponsable || 0
                    }
                });
            } catch (err) {
                console.error("[Dashboard] Error:", err);
                setError("No se encontraron registros para los IDs proporcionados.");
                setResumen(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [searchIds, refreshTrigger]);

    // Fetch project assignments
    useEffect(() => {
        const fetchAsignaciones = async () => {
            try {
                setLoadingAsignaciones(true);
                const data = await getAsignacionesPorProyecto(searchIds.proyectoId);
                setAsignaciones(data);
            } catch (err) {
                console.error("Error al cargar asignaciones:", err);
                setAsignaciones([]);
            } finally {
                setLoadingAsignaciones(false);
            }
        };

        fetchAsignaciones();
    }, [searchIds.proyectoId, refreshTrigger]);

    // Load employees list on mount for autocompletion
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await getEmpleados();
                setAllEmployees(data);
            } catch (err) {
                console.error("Error al cargar empleados para autocompletado:", err);
            }
        };
        loadEmployees();
    }, [refreshTrigger]);

    // Sync employee search text with ID in main search
    useEffect(() => {
        if (allEmployees.length > 0 && tempIds.recursoId) {
            const match = allEmployees.find(emp => emp.id.toString() === tempIds.recursoId.toString());
            if (match) {
                setEmployeeSearchText(match.nombre);
            } else {
                setEmployeeSearchText('');
            }
        } else if (!tempIds.recursoId) {
            setEmployeeSearchText('');
        }
    }, [tempIds.recursoId, allEmployees]);

    const handleEmployeeSearchChange = (e) => {
        const text = e.target.value;
        setEmployeeSearchText(text);
        setShowDropdown(true);
        
        if (!text.trim()) {
            setTempIds(prev => ({ ...prev, recursoId: '' }));
        } else {
            const match = allEmployees.find(emp => emp.nombre.toLowerCase() === text.toLowerCase());
            if (match) {
                setTempIds(prev => ({ ...prev, recursoId: match.id }));
            }
        }
    };

    const handleSelectEmployee = (emp) => {
        setEmployeeSearchText(emp.nombre);
        setTempIds(prev => ({ ...prev, recursoId: emp.id }));
        setShowDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchIds({ ...tempIds });
    };

    const filteredEmployees = allEmployees.filter(emp =>
        emp.nombre.toLowerCase().includes(employeeSearchText.toLowerCase())
    );

    // Modal assignment handlers
    const handleOpenAssignModal = () => {
        setAssignmentForm({
            id: '',
            empleadoId: '',
            horasAsignadas: '',
            nombreEmpleado: '',
            cargoEmpleado: ''
        });
        setAssignSearchText('');
        setModalMode('CREATE');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (asig) => {
        setAssignmentForm({
            id: asig.id,
            empleadoId: asig.empleadoId,
            horasAsignadas: asig.horasAsignadas.toString(),
            nombreEmpleado: asig.nombreEmpleado,
            cargoEmpleado: asig.cargoEmpleado
        });
        setModalMode('EDIT');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAssignSearchChange = (e) => {
        const text = e.target.value;
        setAssignSearchText(text);
        setShowAssignDropdown(true);
        
        if (!text.trim()) {
            setAssignmentForm(prev => ({ ...prev, empleadoId: '' }));
        } else {
            const match = allEmployees.find(emp => emp.nombre.toLowerCase() === text.toLowerCase());
            if (match) {
                setAssignmentForm(prev => ({ ...prev, empleadoId: match.id }));
            }
        }
    };

    const handleSelectModalEmployee = (emp) => {
        setAssignSearchText(emp.nombre);
        setAssignmentForm(prev => ({
            ...prev,
            empleadoId: emp.id,
            nombreEmpleado: emp.nombre,
            cargoEmpleado: emp.cargo
        }));
        setShowAssignDropdown(false);
    };

    const filteredModalEmployees = allEmployees.filter(emp =>
        emp.nombre.toLowerCase().includes(assignSearchText.toLowerCase()) ||
        emp.id.toString().includes(assignSearchText)
    );

    const handleSubmitAssignment = async (e) => {
        e.preventDefault();

        if (modalMode === 'CREATE' && !assignmentForm.empleadoId) {
            alert('Por favor seleccione un empleado válido de la lista desplegable.');
            return;
        }

        const horas = parseInt(assignmentForm.horasAsignadas, 10);
        if (isNaN(horas) || horas < 1 || horas > 45) {
            alert('Las horas asignadas deben ser un número entre 1 y 45.');
            return;
        }

        // Check capacity warnings
        const selectedEmp = allEmployees.find(emp => emp.id.toString() === assignmentForm.empleadoId.toString());
        if (selectedEmp) {
            const currentAsig = asignaciones.find(a => a.empleadoId.toString() === assignmentForm.empleadoId.toString());
            const previousHoras = currentAsig ? currentAsig.horasAsignadas : 0;
            const extraHoras = modalMode === 'CREATE' ? horas : (horas - previousHoras);
            const capacityLimit = selectedEmp.capacidadMaxima || 45;
            
            if (selectedEmp.horasAsignadas + extraHoras > capacityLimit) {
                const confirmed = window.confirm(
                    `Advertencia: El empleado ${selectedEmp.nombre} superará su capacidad máxima (${capacityLimit}h) en la organización. Actualmente tiene ${selectedEmp.horasAsignadas}h asignadas y se le intentan asignar ${horas}h en este proyecto. ¿Desea continuar de todas formas?`
                );
                if (!confirmed) return;
            }
        }

        const payload = {
            proyectoId: parseInt(searchIds.proyectoId, 10),
            empleadoId: parseInt(assignmentForm.empleadoId, 10),
            horasAsignadas: horas
        };

        try {
            if (modalMode === 'CREATE') {
                await crearAsignacion(payload);
            } else {
                await actualizarAsignacion(assignmentForm.id, payload);
            }
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al procesar asignación:", err);
            alert("Error al procesar la asignación. Verifique si el empleado ya tiene una asignación activa en este proyecto.");
        }
    };

    const handleDeleteAssignment = async (asig) => {
        if (window.confirm(`¿Está seguro de que desea desasignar a ${asig.nombreEmpleado} de este proyecto?`)) {
            try {
                await eliminarAsignacionPorProyectoYEmpleado(searchIds.proyectoId, asig.empleadoId);
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error("Error al desasignar:", err);
                alert("Error al eliminar la asignación.");
            }
        }
    };

    const getCargoBadgeClass = (cargo) => {
        const cargoUpper = cargo?.toUpperCase() || '';
        if (cargoUpper.startsWith('DEVELOPER')) {
            return 'bg-primary';
        } else if (cargoUpper === 'UX_DESIGNER' || cargoUpper === 'UX_DESIGNER_LEAD') {
            return 'bg-info text-dark';
        } else if (cargoUpper.startsWith('UX')) {
            return 'bg-warning text-dark';
        } else {
            return 'bg-secondary';
        }
    };

    return (
        <div className="dashboard-content">
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body bg-white rounded-3">
                    <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-muted">ID DE PROYECTO</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={tempIds.proyectoId}
                                onChange={(e) => setTempIds({...tempIds, proyectoId: e.target.value})}
                                placeholder="Ej: 1"
                            />
                        </div>
                        <div className="col-md-4 position-relative">
                            <label className="form-label small fw-bold text-muted">BUSCAR EMPLEADO</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={employeeSearchText}
                                onChange={handleEmployeeSearchChange}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                placeholder="Escribe el nombre del empleado..."
                            />
                            {showDropdown && employeeSearchText && filteredEmployees.length > 0 && (
                                <ul className="dropdown-menu show w-100 position-absolute start-0 mt-1 shadow-lg" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1050 }}>
                                    {filteredEmployees.map(emp => (
                                        <li key={emp.id}>
                                            <button
                                                type="button"
                                                className="dropdown-item py-2 border-bottom"
                                                onClick={() => handleSelectEmployee(emp)}
                                                style={{ textAlign: 'left' }}
                                            >
                                                <div className="fw-semibold text-dark">{emp.nombre}</div>
                                                <small className="text-muted">ID: {emp.id} - {emp.cargo}</small>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold text-muted">ID RECURSO</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={tempIds.recursoId}
                                onChange={(e) => setTempIds({...tempIds, recursoId: e.target.value})}
                                placeholder="ID"
                            />
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
                                ACTUALIZAR VISTA
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <header className="mb-4">
                <h1 className="h3 mb-1 fw-bold text-dark">Panel de Control General</h1>
                <p className="text-muted">
                    Mostrando métricas de orquestación para <strong>Proyecto #{searchIds.proyectoId}</strong> y <strong>Recurso #{searchIds.recursoId}</strong>
                </p>
            </header>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted fw-500">Consultando Microservicios...</p>
                </div>
            ) : error ? (
                <div className="alert alert-warning border-0 shadow-sm p-4">
                    <h5 className="fw-bold">Aviso del Sistema</h5>
                    {error}
                </div>
            ) : (
                <>
                    <div className="row g-4">
                        <div className="col-xl-6 col-lg-12">
                            <ProjectSummaryCard project={resumen?.project} />
                        </div>

                        <div className="col-xl-6 col-lg-12">
                            <EmployeeCapacityCard employee={resumen?.employee} />
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 bg-white rounded-3 mt-4">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-0 text-dark">Personal Asignado al Proyecto</h5>
                                <p className="text-muted small mb-0">Gestión de recursos y horas dedicadas para este proyecto.</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary fw-bold btn-sm px-3 shadow-sm"
                                onClick={handleOpenAssignModal}
                            >
                                + ASIGNAR RECURSO
                            </button>
                        </div>
                        <div className="card-body px-4 pb-4">
                            {loadingAsignaciones ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                                    <p className="mt-2 text-muted small">Cargando asignaciones...</p>
                                </div>
                            ) : asignaciones.length === 0 ? (
                                <div className="text-center py-5 text-muted border rounded-3 bg-light">
                                    No hay empleados asignados a este proyecto actualmente.
                                </div>
                            ) : (
                                /* Internal Scrollable Viewport for Project Assignments */
                                <div className="table-responsive" style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                                            <tr>
                                                <th className="border-bottom text-center">ID Empleado</th>
                                                <th className="border-bottom">Nombre</th>
                                                <th className="border-bottom">Cargo / Rol</th>
                                                <th className="border-bottom text-center">Horas Dedicadas</th>
                                                <th className="border-bottom text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {asignaciones.map((asig) => (
                                                <tr key={asig.id || `${asig.proyectoId}-${asig.empleadoId}`} style={{ transition: 'background-color 0.2s' }}>
                                                    <td className="text-center fw-bold text-muted">#{asig.empleadoId}</td>
                                                    <td className="fw-bold text-dark">{asig.nombreEmpleado || 'Cargando...'}</td>
                                                    <td>
                                                        <span className={`badge ${getCargoBadgeClass(asig.cargoEmpleado)} px-2 py-1`}>
                                                            {asig.cargoEmpleado || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center fw-semibold text-secondary">{asig.horasAsignadas}h / semana</td>
                                                    <td className="text-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm me-2 fw-semibold"
                                                            onClick={() => handleOpenEditModal(asig)}
                                                        >
                                                            Editar Horas
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm fw-semibold"
                                                            onClick={() => handleDeleteAssignment(asig)}
                                                        >
                                                            Desasignar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Custom Interactive Assign/Edit Modal */}
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '0.75rem' }}>
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold">
                                    {modalMode === 'CREATE' ? 'Asignar Empleado al Proyecto' : 'Editar Horas de Asignación'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleSubmitAssignment}>
                                <div className="modal-body p-4">
                                    {modalMode === 'CREATE' ? (
                                        <div className="mb-3 position-relative">
                                            <label className="form-label small fw-bold text-muted mb-1">BUSCAR EMPLEADO</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg text-dark"
                                                placeholder="Escribe el nombre del empleado..."
                                                value={assignSearchText}
                                                onChange={handleAssignSearchChange}
                                                onFocus={() => setShowAssignDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowAssignDropdown(false), 200)}
                                                required
                                            />
                                            {showAssignDropdown && assignSearchText && filteredModalEmployees.length > 0 && (
                                                <ul className="dropdown-menu show w-100 position-absolute start-0 mt-1 shadow-lg" style={{ maxHeight: '180px', overflowY: 'auto', zIndex: 1060 }}>
                                                    {filteredModalEmployees.map(emp => (
                                                        <li key={emp.id}>
                                                            <button
                                                                type="button"
                                                                className="dropdown-item py-2 border-bottom text-start"
                                                                onClick={() => handleSelectModalEmployee(emp)}
                                                            >
                                                                <div className="fw-semibold text-dark">{emp.nombre}</div>
                                                                <small className="text-muted">ID: {emp.id} - {emp.cargo} (Asignado: {emp.horasAsignadas}h / Máx: {emp.capacidadMaxima}h)</small>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="form-text text-muted small mt-1">
                                                {assignmentForm.empleadoId ? `Seleccionado: ${assignmentForm.nombreEmpleado} (ID #${assignmentForm.empleadoId})` : 'Escribe para buscar y selecciona de la lista.'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted mb-1">EMPLEADO</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg bg-light text-dark fw-semibold"
                                                value={assignmentForm.nombreEmpleado || ''}
                                                readOnly
                                            />
                                            <div className="form-text text-muted small mt-1">
                                                Cargo: {assignmentForm.cargoEmpleado || 'N/A'} (ID: #{assignmentForm.empleadoId})
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted mb-1">HORAS ASIGNADAS (SEMANALES)</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-lg text-dark"
                                            placeholder="Ej: 15"
                                            min="1"
                                            max="45"
                                            value={assignmentForm.horasAsignadas}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, horasAsignadas: e.target.value })}
                                            required
                                        />
                                        <div className="form-text text-muted small mt-1">
                                            Las horas deben estar entre 1 y 45 horas semanales.
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light py-3 border-0">
                                    <button type="button" className="btn btn-light fw-bold border" onClick={handleCloseModal}>
                                        CANCELAR
                                    </button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">
                                        {modalMode === 'CREATE' ? 'ASIGNAR RECURSO' : 'GUARDAR CAMBIOS'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;