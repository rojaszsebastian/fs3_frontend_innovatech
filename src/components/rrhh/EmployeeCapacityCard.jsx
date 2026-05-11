import React from 'react';

export default function EmployeeCapacityCard({ employee }) {
    return (
        <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
            <div className="card-body">
                <h6 className="text-info text-uppercase small fw-bold mb-3">Responsable de Célula</h6>
                <h4 className="card-title fw-bold">{employee?.name || "Sin asignar"}</h4>
                <div className="mt-3">
                    <p className="mb-1 text-muted"><strong>Cargo:</strong> {employee?.role || "N/A"}</p>
                    <div className="mt-3">
                        <small className="d-block mb-1 fw-bold">Capacidad de Carga:</small>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar bg-info"
                                role="progressbar"
                                style={{ width: `${employee?.capacity}%` }}
                            ></div>
                        </div>
                        <small className="text-muted mt-1 d-block text-end">{employee?.capacity}% disponible</small>
                    </div>
                </div>
            </div>
        </div>
    );
}