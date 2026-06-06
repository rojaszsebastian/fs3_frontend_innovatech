import React, { useState, useEffect } from 'react';
import { getEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from '../services/recursosService';
import '../styles/dashboard.css';

const RecursosPage = () => {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form state (numbers stored as string/empty to solve the deleting '0' issue)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        cargo: 'DEVELOPER',
        horasAsignadas: '',
        capacidadMaxima: '45'
    });

    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadEmpleados();
    }, []);

    const loadEmpleados = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEmpleados();
            setEmpleados(data);
        } catch (err) {
            setError('Error al cargar la lista de empleados.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Keep as string to allow easy editing of numbers
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = (data) => {
        if (!data.nombre.trim()) return 'El nombre es obligatorio';
        if (!data.email.trim()) return 'El email es obligatorio';
        if (!/\S+@\S+\.\S+/.test(data.email)) return 'El formato del email es inválido';
        if (!data.cargo) return 'El cargo es obligatorio';
        if (data.horasAsignadas < 0) return 'Las horas asignadas no pueden ser negativas';
        if (data.horasAsignadas > 45) return 'Las horas asignadas no pueden exceder las 45 horas semanales';
        if (data.capacidadMaxima < 0) return 'La capacidad máxima no puede ser negativa';
        if (data.capacidadMaxima > 45) return 'La capacidad máxima no puede exceder las 45 horas semanales';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Parse numbers safely for the microservice
        const payload = {
            ...formData,
            horasAsignadas: formData.horasAsignadas === '' ? 0 : parseInt(formData.horasAsignadas, 10),
            capacidadMaxima: formData.capacidadMaxima === '' ? 0 : parseInt(formData.capacidadMaxima, 10)
        };

        const validationError = validateForm(payload);
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            setSubmitLoading(true);
            if (editingId) {
                await actualizarEmpleado(editingId, payload);
            } else {
                await crearEmpleado(payload);
            }
            // Reset form
            handleResetForm();
            // Reload list
            await loadEmpleados();
        } catch (err) {
            console.error(err);
            alert('Error al guardar el empleado. Asegúrese de que el email no esté duplicado.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (emp) => {
        setEditingId(emp.id);
        setFormData({
            nombre: emp.nombre,
            email: emp.email,
            cargo: emp.cargo,
            horasAsignadas: emp.horasAsignadas.toString(),
            capacidadMaxima: emp.capacidadMaxima.toString()
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
            try {
                await eliminarEmpleado(id);
                await loadEmpleados();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar el empleado.');
            }
        }
    };

    const handleResetForm = () => {
        setEditingId(null);
        setFormData({
            nombre: '',
            email: '',
            cargo: 'DEVELOPER',
            horasAsignadas: '',
            capacidadMaxima: '45'
        });
    };

    const getCargoBadgeClass = (cargo) => {
        const cargoUpper = cargo?.toUpperCase() || '';
        if (cargoUpper.startsWith('DEVELOPER')) {
            return 'bg-primary';
        } else if (cargoUpper === 'UX_DESIGNER' || cargoUpper === 'UX_DESIGNER_LEAD') {
            return 'bg-info text-dark';
        } else if (cargoUpper.startsWith('UX')) {
            return 'bg-warning text-dark';
        } else {
            return 'bg-secondary';
        }
    };

    const filteredEmpleados = empleados.filter(emp =>
        emp.id.toString().includes(searchQuery) ||
        emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.cargo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 mb-1 fw-bold text-dark">Gestión de Recursos Humanos</h1>
                    <p className="text-muted">Administra el personal, asigna horas de trabajo y evalúa sus capacidades.</p>
                </div>
            </header>

            <div className="row g-4">
                {/* List Table Column */}
                <div className="col-xl-8 col-lg-7">
                    <div className="card shadow-sm border-0 bg-white rounded-3 mb-4">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">Lista de Empleados</h5>
                            <div style={{ width: '250px' }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar por ID, nombre, email o cargo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="card-body px-4 pb-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-3 text-muted">Cargando lista de empleados...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger border-0">{error}</div>
                            ) : filteredEmpleados.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    No se encontraron empleados registrados.
                                </div>
                            ) : (
                                /* Internal Scrollable Viewport (Ventana Interna con scroll) */
                                <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                                            <tr>
                                                <th className="border-bottom text-center">ID</th>
                                                <th className="border-bottom">Nombre</th>
                                                <th className="border-bottom">Email</th>
                                                <th className="border-bottom">Cargo</th>
                                                <th className="border-bottom text-center">Horas Asig.</th>
                                                <th className="border-bottom text-center">Cap. Max.</th>
                                                <th className="border-bottom text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEmpleados.map((emp) => (
                                                <tr key={emp.id} style={{ transition: 'background-color 0.2s' }}>
                                                    <td className="text-center fw-bold text-muted">#{emp.id}</td>
                                                    <td className="fw-bold text-dark">{emp.nombre}</td>
                                                    <td>{emp.email}</td>
                                                    <td>
                                                        <span className={`badge ${getCargoBadgeClass(emp.cargo)} px-2 py-1`}>
                                                            {emp.cargo}
                                                        </span>
                                                    </td>
                                                    <td className="text-center fw-semibold text-secondary">{emp.horasAsignadas}h</td>
                                                    <td className="text-center fw-semibold text-secondary">{emp.capacidadMaxima}h</td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2 fw-semibold"
                                                            onClick={() => handleEdit(emp)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm fw-semibold"
                                                            onClick={() => handleDelete(emp.id)}
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
                                {editingId ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">NOMBRE COMPLETO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Rodrigo Gallardo"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">CORREO ELECTRÓNICO</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Ej: r.gallardo@innovatech.cl"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">CARGO / ROL</label>
                                    <select
                                        className="form-select"
                                        name="cargo"
                                        value={formData.cargo}
                                        onChange={handleInputChange}
                                    >
                                        <option value="DEVELOPER">Developer (Estrategia Dev)</option>
                                        <option value="DEVELOPER_FRONTEND">Developer Frontend (Estrategia Dev)</option>
                                        <option value="DEVELOPER_BACKEND">Developer Backend (Estrategia Dev)</option>
                                        <option value="DEVELOPER_FULLSTACK">Developer Fullstack (Estrategia Dev)</option>
                                        <option value="DEVELOPER_LEAD">Lead Developer (Estrategia Dev)</option>
                                        <option value="UX_DESIGNER">UX Designer (Estrategia UX)</option>
                                        <option value="UX_DESIGNER_LEAD">Lead UX Designer (Estrategia UX)</option>
                                        <option value="UX_RESEARCHER">UX Researcher (Estrategia UX Especializada)</option>
                                        <option value="UX_UI_DESIGNER">UX/UI Designer (Estrategia UX Especializada)</option>
                                        <option value="UX">UX Specialist (Estrategia UX Especializada)</option>
                                    </select>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">HORAS ASIGNADAS</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="horasAsignadas"
                                            min="0"
                                            max="45"
                                            value={formData.horasAsignadas}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">CAPACIDAD MÁXIMA</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="capacidadMaxima"
                                            min="0"
                                            max="45"
                                            value={formData.capacidadMaxima}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
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
                                        'REGISTRAR EMPLEADO'
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

export default RecursosPage;
