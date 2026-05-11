import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';

const RecursosPage = () => <h2 className="fw-bold">Gestión de Recursos Humanos</h2>;
const ProyectosPage = () => <h2 className="fw-bold">Gestión de Proyectos Activos</h2>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/recursos" element={<RecursosPage />} />
                    <Route path="/proyectos" element={<ProyectosPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;