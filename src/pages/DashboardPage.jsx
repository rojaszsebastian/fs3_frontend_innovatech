import React, { useState, useEffect } from 'react';
import { getDashboardResumen } from '../services/dashboardService';
import { getEmpleados } from '../services/recursosService';
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

    // Autocomplete states
    const [allEmployees, setAllEmployees] = useState([]);
    const [employeeSearchText, setEmployeeSearchText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

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
    }, [searchIds]);

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
    }, []);

    // Sync employee search text with ID
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
                <div className="row g-4">
                    <div className="col-xl-6 col-lg-12">
                        <ProjectSummaryCard project={resumen?.project} />
                    </div>

                    <div className="col-xl-6 col-lg-12">
                        <EmployeeCapacityCard employee={resumen?.employee} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;