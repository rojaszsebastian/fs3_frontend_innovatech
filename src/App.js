import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import RecursosPage from './pages/RecursosPage';
import ProyectosPage from './pages/ProyectosPage';
import NotificacionesPage from './pages/NotificacionesPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/recursos" element={<RecursosPage />} />
                    <Route path="/proyectos" element={<ProyectosPage />} />
                    <Route path="/notificaciones" element={<NotificacionesPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;