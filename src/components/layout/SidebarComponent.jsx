import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarComponent() {
    return (
        <div className="sidebar vh-100 p-3 border-end bg-white shadow-sm" style={{ width: '250px' }}>
            <h5 className="mb-4 text-muted small text-uppercase fw-bold">Módulos</h5>

            <ul className="nav nav-pills flex-column">
                <li className="nav-item mb-2">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
                        Resumen General
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/recursos" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
                        Recursos Humanos
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/proyectos" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
                        Gestión de Proyectos
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/notificaciones" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
                        Notificaciones
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}