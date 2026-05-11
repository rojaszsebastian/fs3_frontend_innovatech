import React from 'react';

export default function NavbarComponent() {
    return (
        <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1 fw-bold text-primary">
                    INNOVATECH <span className="text-white">SOLUTIONS</span>
                </span>
                <div className="d-flex align-items-center">
                    <span className="text-light me-3 small">Sistema de Gestión Proyectos</span>
                </div>
            </div>
        </nav>
    );
}