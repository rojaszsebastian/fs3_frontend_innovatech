import React, { useState, useEffect } from 'react';
import { getNotificaciones, marcarComoLeida } from '../services/notificacionesService';
import '../styles/dashboard.css';

const NotificacionesPage = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Active filter state: 'ALL', 'OVERLOADED', 'UNDERLOADED', 'UNREAD'
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        loadNotificaciones();
    }, []);

    const loadNotificaciones = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNotificaciones();
            // Sort by unread first, then by date descending (or ID descending)
            const sortedData = data.sort((a, b) => {
                if (a.leida === b.leida) {
                    return b.id - a.id;
                }
                return a.leida ? 1 : -1;
            });
            setNotificaciones(sortedData);
        } catch (err) {
            setError('Error al obtener las notificaciones de carga laboral.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await marcarComoLeida(id);
            // Update local state smoothly
            setNotificaciones(prev =>
                prev.map(n => n.id === id ? { ...n, leida: true } : n)
                    .sort((a, b) => {
                        if (a.leida === b.leida) {
                            return b.id - a.id;
                        }
                        return a.leida ? 1 : -1;
                    })
            );
        } catch (err) {
            console.error('Error al marcar como leída:', err);
            alert('No se pudo marcar la notificación como leída.');
        }
    };

    const countUnread = notificaciones.filter(n => !n.leida).length;
    const countOverloaded = notificaciones.filter(n => n.tipo === 'ALERTA' && !n.leida).length;
    const countUnderloaded = notificaciones.filter(n => n.tipo === 'INFO' && !n.leida).length;

    // Filtered list based on metric card clicks
    const filteredNotificaciones = notificaciones.filter(notif => {
        if (activeFilter === 'OVERLOADED') {
            return notif.tipo === 'ALERTA' && !notif.leida;
        }
        if (activeFilter === 'UNDERLOADED') {
            return notif.tipo === 'INFO' && !notif.leida;
        }
        if (activeFilter === 'UNREAD') {
            return !notif.leida;
        }
        return true; // 'ALL'
    });

    // Extrapolate overloaded and underloaded employees from notifications
    const getRecommendations = () => {
        const activeOverloaded = notificaciones
            .filter(n => n.tipo === 'ALERTA' && !n.leida)
            .map(n => {
                const name = n.titulo.replace('Sobrecarga: ', '').trim();
                let capStr = "0h disp.";
                const match = n.mensaje.match(/disponibilidad crítica de ([\d.]+) horas/);
                if (match) {
                    capStr = parseFloat(match[1]) + "h disp.";
                }
                return { name, capStr };
            });
        
        const activeUnderloaded = notificaciones
            .filter(n => n.tipo === 'Baja Carga' || (n.tipo === 'INFO' && n.titulo.startsWith('Baja Carga:')))
            .filter(n => !n.leida)
            .map(n => {
                const name = n.titulo.replace('Baja Carga: ', '').trim();
                let capStr = "35h+ disp.";
                const match = n.mensaje.match(/([\d.]+)h disponibles/) || n.mensaje.match(/capacidad de ([\d.]+) horas/);
                if (match) {
                    capStr = parseFloat(match[1]) + "h disp.";
                }
                return { name, capStr };
            });

        if (activeOverloaded.length > 0 && activeUnderloaded.length > 0) {
            // Take up to 3 for pairing suggestions
            const limit = Math.min(activeOverloaded.length, activeUnderloaded.length, 3);
            const suggestionsList = [];
            for (let i = 0; i < limit; i++) {
                suggestionsList.push({
                    from: activeOverloaded[i],
                    to: activeUnderloaded[i]
                });
            }

            return (
                <div>
                    <div className="alert alert-info border-0 shadow-sm p-3 mb-4">
                        <h6 className="fw-bold text-info text-uppercase mb-2 small">Sugerencia de Reasignación Directa</h6>
                        <div className="d-flex flex-column gap-2">
                            {suggestionsList.map((sug, idx) => (
                                <div key={idx} className="bg-white p-2 rounded border-start border-3 border-info d-flex align-items-center justify-content-between shadow-xs">
                                    <div className="text-start">
                                        <span className="fw-bold text-dark d-block small text-truncate" style={{ maxWidth: '110px' }}>{sug.from.name}</span>
                                        <span className="text-danger small">{sug.from.capStr}</span>
                                    </div>
                                    <span className="text-muted fw-bold px-1">➔</span>
                                    <div className="text-end">
                                        <span className="fw-bold text-dark d-block small text-truncate" style={{ maxWidth: '110px' }}>{sug.to.name}</span>
                                        <span className="text-success small">{sug.to.capStr}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row g-2 text-start">
                        <div className="col-6">
                            <div className="p-2 border rounded bg-light" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                <span className="fw-bold text-danger d-block mb-1 small">Sobrecargados ({activeOverloaded.length})</span>
                                <ul className="list-unstyled mb-0 small text-muted">
                                    {activeOverloaded.slice(0, 5).map((e, idx) => (
                                        <li key={idx} className="text-truncate">• {e.name}</li>
                                    ))}
                                    {activeOverloaded.length > 5 && (
                                        <li className="fw-semibold text-dark mt-1">y {activeOverloaded.length - 5} más...</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-2 border rounded bg-light" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                <span className="fw-bold text-success d-block mb-1 small">Disponibles ({activeUnderloaded.length})</span>
                                <ul className="list-unstyled mb-0 small text-muted">
                                    {activeUnderloaded.slice(0, 5).map((e, idx) => (
                                        <li key={idx} className="text-truncate">• {e.name}</li>
                                    ))}
                                    {activeUnderloaded.length > 5 && (
                                        <li className="fw-semibold text-dark mt-1">y {activeUnderloaded.length - 5} más...</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="alert alert-light border shadow-sm p-4 text-center">
                <h6 className="fw-bold text-muted text-uppercase mb-2 small">Estado de Balance</h6>
                <p className="mb-0 text-muted">No se detectan oportunidades inmediatas de reasignación en este momento.</p>
            </div>
        );
    };

    return (
        <div className="container-fluid py-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 mb-1 fw-bold text-dark">Notificaciones de Balance de Carga</h1>
                    <p className="text-muted">Monitoreo automático de la distribución de trabajo en las células ágiles.</p>
                </div>
                <button 
                    className="btn btn-primary fw-bold shadow-sm d-flex align-items-center px-4" 
                    onClick={loadNotificaciones}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Actualizando...
                        </>
                    ) : (
                        'Buscar Alertas'
                    )}
                </button>
            </header>

            {/* Metrics cards (Interactive filters) */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div 
                        className={`card shadow-sm border-0 border-start border-warning border-4 bg-white h-100 ${activeFilter === 'OVERLOADED' ? 'border-2 ring-warning shadow-md bg-warning-subtle' : ''}`}
                        onClick={() => setActiveFilter(activeFilter === 'OVERLOADED' ? 'ALL' : 'OVERLOADED')}
                        style={{ cursor: 'pointer', transition: 'all 0.2s', border: activeFilter === 'OVERLOADED' ? '1px solid #ffc107' : 'none' }}
                    >
                        <div className="card-body">
                            <h6 className="text-warning text-uppercase small fw-bold mb-1">Sobrecargas Pendientes</h6>
                            <h2 className="fw-bold mb-0 text-dark">{countOverloaded}</h2>
                            <small className="text-muted small">{activeFilter === 'OVERLOADED' ? 'Filtrado activo (clic para limpiar)' : 'Clic para filtrar'}</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div 
                        className={`card shadow-sm border-0 border-start border-info border-4 bg-white h-100 ${activeFilter === 'UNDERLOADED' ? 'border-2 ring-info shadow-md bg-info-subtle' : ''}`}
                        onClick={() => setActiveFilter(activeFilter === 'UNDERLOADED' ? 'ALL' : 'UNDERLOADED')}
                        style={{ cursor: 'pointer', transition: 'all 0.2s', border: activeFilter === 'UNDERLOADED' ? '1px solid #0dcaf0' : 'none' }}
                    >
                        <div className="card-body">
                            <h6 className="text-info text-uppercase small fw-bold mb-1">Baja Asignación Pendiente</h6>
                            <h2 className="fw-bold mb-0 text-dark">{countUnderloaded}</h2>
                            <small className="text-muted small">{activeFilter === 'UNDERLOADED' ? 'Filtrado activo (clic para limpiar)' : 'Clic para filtrar'}</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div 
                        className={`card shadow-sm border-0 border-start border-primary border-4 bg-white h-100 ${activeFilter === 'UNREAD' ? 'border-2 ring-primary shadow-md bg-primary-subtle' : ''}`}
                        onClick={() => setActiveFilter(activeFilter === 'UNREAD' ? 'ALL' : 'UNREAD')}
                        style={{ cursor: 'pointer', transition: 'all 0.2s', border: activeFilter === 'UNREAD' ? '1px solid #0d6efd' : 'none' }}
                    >
                        <div className="card-body">
                            <h6 className="text-primary text-uppercase small fw-bold mb-1">Total sin Leer</h6>
                            <h2 className="fw-bold mb-0 text-dark">{countUnread}</h2>
                            <small className="text-muted small">{activeFilter === 'UNREAD' ? 'Filtrado activo (clic para limpiar)' : 'Clic para filtrar'}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Notifications List column */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 bg-white rounded-3">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">
                                Alertas de Balanceamiento {activeFilter !== 'ALL' && <span className="badge bg-secondary ms-2 small" style={{ fontSize: '0.75rem' }}>Filtro activo</span>}
                            </h5>
                            {activeFilter !== 'ALL' && (
                                <button className="btn btn-sm btn-link text-primary fw-semibold p-0 text-decoration-none" onClick={() => setActiveFilter('ALL')}>
                                    Ver Todas
                                </button>
                            )}
                        </div>
                        <div className="card-body p-4">
                            {loading && notificaciones.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-3 text-muted">Consultando microservicio de notificaciones...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger border-0">{error}</div>
                            ) : filteredNotificaciones.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    No hay notificaciones que coincidan con el filtro seleccionado.
                                </div>
                            ) : (
                                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {filteredNotificaciones.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            className={`card mb-3 border-0 rounded-3 shadow-sm ${notif.leida ? 'bg-light opacity-75' : 'bg-white border-start border-3 border-' + (notif.tipo === 'ALERTA' ? 'danger' : 'info')}`}
                                            style={{ transition: 'all 0.3s' }}
                                        >
                                            <div className="card-body d-flex justify-content-between align-items-center p-3">
                                                <div className="pe-3">
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <span className={`badge ${notif.tipo === 'ALERTA' ? 'bg-danger' : 'bg-info text-dark'} small`}>
                                                            {notif.tipo === 'ALERTA' ? 'SOBRECARGA' : 'INFO'}
                                                        </span>
                                                        <span className="text-muted small">
                                                            {new Date(notif.fecha).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <h6 className={`mb-1 fw-bold ${notif.leida ? 'text-muted' : 'text-dark'}`}>
                                                        {notif.titulo}
                                                    </h6>
                                                    <p className="mb-0 text-muted small">{notif.mensaje}</p>
                                                </div>
                                                <div>
                                                    {!notif.leida && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary fw-semibold whitespace-nowrap"
                                                            onClick={() => handleMarkAsRead(notif.id)}
                                                        >
                                                            Marcar Leída
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommendations column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 bg-white rounded-3 h-100">
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0 text-dark">Centro de Decisiones</h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                El sistema analiza la capacidad disponible del personal y sugiere alternativas para 
                                asegurar que ningún empleado supere sus límites saludables o quede inactivo.
                            </p>
                            {getRecommendations()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificacionesPage;
