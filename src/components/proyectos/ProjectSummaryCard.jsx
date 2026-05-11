import React from 'react';

export default function ProjectSummaryCard({ project }) {
    return (
        <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
                <h6 className="text-primary text-uppercase small fw-bold mb-3">Proyecto Activo</h6>
                <h4 className="card-title fw-bold">{project?.name || "Cargando proyecto..."}</h4>
                <div className="mt-3">
                    <p className="mb-1"><strong>Estado:</strong> <span className="badge bg-success">{project?.status}</span></p>
                    <p className="mb-0 fs-5 text-dark"><strong>{project?.totalHours}</strong> horas estimadas</p>
                </div>
            </div>
        </div>
    );
}