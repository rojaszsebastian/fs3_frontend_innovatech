import React, { useState, useEffect } from 'react';
import { getDashboardResumen } from '../services/dashboardService';
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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchIds({ ...tempIds });
    };

    return (
        <div className="dashboard-content">
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body bg-white rounded-3">
                    <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold text-muted">ID DE PROYECTO</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={tempIds.proyectoId}
                                onChange={(e) => setTempIds({...tempIds, proyectoId: e.target.value})}
                                placeholder="Ej: 1"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold text-muted">ID DE RECURSO (RRHH)</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={tempIds.recursoId}
                                onChange={(e) => setTempIds({...tempIds, recursoId: e.target.value})}
                                placeholder="Ej: 1"
                            />
                        </div>
                        <div className="col-md-4">
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
                    Mostrando métricas de orquestación para <strong>Proyecto #{searchIds.proyectoId}</strong>
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