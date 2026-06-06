import React, { useState, useEffect } from 'react';
import { getProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from '../services/proyectosService';
import '../styles/dashboard.css';

const ProyectosPage = () => {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        estado: 'ACTIVO'
    });

    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProyectos();
    }, []);

    const loadProyectos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProyectos();
            setProyectos(data);
        } catch (err) {
            setError('Error al cargar la lista de proyectos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) return 'El nombre del proyecto es obligatorio';
        if (formData.nombre.length > 100) return 'El nombre no puede exceder los 100 caracteres';
        if (formData.descripcion.length > 255) return 'La descripción no puede exceder los 255 caracteres';
        if (!formData.fechaInicio) return 'La fecha de inicio es obligatoria';
        if (!formData.estado) return 'El estado es obligatorio';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            setSubmitLoading(true);
            if (editingId) {
                await actualizarProyecto(editingId, formData);
            } else {
                await crearProyecto(formData);
            }
            handleResetForm();
            await loadProyectos();
        } catch (err) {
            console.error(err);
            alert('Error al guardar el proyecto. Intente nuevamente.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (proj) => {
        setEditingId(proj.id);
        setFormData({
            nombre: proj.nombre,
            descripcion: proj.descripcion || '',
            fechaInicio: proj.fechaInicio,
            estado: proj.estado
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este proyecto?')) {
            try {
                await eliminarProyecto(id);
                await loadProyectos();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar el proyecto.');
            }
        }
    };

    const handleResetForm = () => {
        setEditingId(null);
        setFormData({
            nombre: '',
            descripcion: '',
            fechaInicio: '',
            estado: 'ACTIVO'
        });
    };

    const getEstadoBadgeClass = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ACTIVO':
                return 'bg-success';
            case 'PLANIFICADO':
                return 'bg-primary';
            case 'FINALIZADO':
                return 'bg-secondary';
            case 'SUSPENDIDO':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const filteredProyectos = proyectos.filter(proj =>
        proj.id.toString().includes(searchQuery) ||
        proj.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.descripcion && proj.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        proj.estado.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 mb-1 fw-bold text-dark">Gestión de Proyectos</h1>
                    <p className="text-muted">Administra el portafolio de proyectos de la organización.</p>
                </div>
            </header>

            <div className="row g-4">
                {/* List Table Column */}
                <div className="col-xl-8 col-lg-7">
                    <div className="card shadow-sm border-0 bg-white rounded-3 mb-4">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">Lista de Proyectos</h5>
                            <div style={{ width: '250px' }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar por ID, nombre o estado..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="card-body px-4 pb-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-3 text-muted">Cargando lista de proyectos...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger border-0">{error}</div>
                            ) : filteredProyectos.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    No se encontraron proyectos registrados.
                                </div>
                            ) : (
                                /* Scrollable Table Window */
                                <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                                            <tr>
                                                <th className="border-bottom text-center">ID</th>
                                                <th className="border-bottom">Nombre</th>
                                                <th className="border-bottom">Descripción</th>
                                                <th className="border-bottom text-center">Fecha Inicio</th>
                                                <th className="border-bottom text-center">Estado</th>
                                                <th className="border-bottom text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProyectos.map((proj) => (
                                                <tr key={proj.id} style={{ transition: 'background-color 0.2s' }}>
                                                    <td className="text-center fw-bold text-muted">#{proj.id}</td>
                                                    <td className="fw-bold text-dark">{proj.nombre}</td>
                                                    <td>{proj.descripcion || <span className="text-muted small">Sin descripción</span>}</td>
                                                    <td className="text-center">{proj.fechaInicio}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${getEstadoBadgeClass(proj.estado)} px-2 py-1`}>
                                                            {proj.estado}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2 fw-semibold"
                                                            onClick={() => handleEdit(proj)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm fw-semibold"
                                                            onClick={() => handleDelete(proj.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="col-xl-4 col-lg-5">
                    <div className="card shadow-sm border-0 bg-white rounded-3 h-100">
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0 text-dark">
                                {editingId ? 'Editar Proyecto' : 'Registrar Nuevo Proyecto'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">NOMBRE DEL PROYECTO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Migración AWS"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">DESCRIPCIÓN</label>
                                    <textarea
                                        className="form-control"
                                        name="descripcion"
                                        rows="3"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Detalle de las metas y alcances..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">FECHA DE INICIO</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fechaInicio"
                                        value={formData.fechaInicio}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">ESTADO</label>
                                    <select
                                        className="form-select"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="PLANIFICADO">Planificado</option>
                                        <option value="FINALIZADO">Finalizado</option>
                                        <option value="SUSPENDIDO">Suspendido</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold py-2 mb-2 shadow-sm"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                    ) : editingId ? (
                                        'GUARDAR CAMBIOS'
                                    ) : (
                                        'CREAR PROYECTO'
                                    )}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-light w-100 fw-bold py-2 border"
                                        onClick={handleResetForm}
                                    >
                                        CANCELAR
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProyectosPage;
