import React, { useState, useEffect } from 'react';
import { getDashboardResumen } from '../services/dashboardService';
import ProjectSummaryCard from '../components/proyectos/ProjectSummaryCard';
import EmployeeCapacityCard from '../components/rrhh/EmployeeCapacityCard';
import SidebarComponent from '../components/layout/SidebarComponent';
import NavbarComponent from '../components/layout/NavbarComponent';

const DashboardPage = () => {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getDashboardResumen(1, 1);

                setResumen({
                    project: {
                        name: data.nombreProyecto,
                        status: data.estadoProyecto,
                        totalHours: data.totalHoras
                    },
                    employee: {
                        name: data.nombreResponsable,
                        role: data.cargoResponsable,
                        capacity: 75
                    }
                });
            } catch (err) {
                setError("Error al conectar con el orquestador BFF");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando dashboard...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-5" role="alert">
            {error}. Asegúrate de que el BFF (puerto 8080) esté corriendo.
        </div>
    );

    return (
        <div className="d-flex bg-light min-vh-100">
            <SidebarComponent />
            <div className="flex-grow-1">
                <NavbarComponent />
                <div className="container-fluid p-4">
                    <header className="mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Panel de Control Innovatech</h1>
                        <p className="text-muted">Vista unificada de Proyectos y Recursos</p>
                    </header>

                    <div className="row g-4">
                        {/* Tarjeta de Proyecto con las 34 horas calculadas */}
                        <div className="col-xl-6 col-md-12">
                            <ProjectSummaryCard project={resumen?.project} />
                        </div>

                        {/* Tarjeta de Responsable (MS RRHH) */}
                        <div className="col-xl-6 col-md-12">
                            <EmployeeCapacityCard employee={resumen?.employee} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;