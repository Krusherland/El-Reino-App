import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { ScrollService } from '../../services/ScrollService';
import { KingdomForm, KingdomInput } from '../common/forms';
import { KingdomAlert } from '../common/KingdomComponents';

export const Scrolls = () => {
  const { auth } = useAuth();
  const [scrolls, setScrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { formValues, handleChange, resetForm } = useForm({
    content: ''
  });

  useEffect(() => {
    loadUserScrolls();
  }, []);

  const loadUserScrolls = async () => {
    if (!auth?._id) return;
    
    try {
      setLoading(true);
      const response = await ScrollService.getUserScrolls(auth._id);
      setScrolls(response.scrolls || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      await ScrollService.createScroll(formValues);
      setSuccess('¡Pergamino creado exitosamente! Tu mensaje será visible en las mazmorras.');
      resetForm();
      setShowForm(false);
      loadUserScrolls(); // Reload user scrolls
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scrollId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este pergamino?')) {
      return;
    }

    try {
      setLoading(true);
      await ScrollService.deleteScroll(scrollId);
      setSuccess('Pergamino eliminado exitosamente.');
      loadUserScrolls();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.name) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Acceso Restringido</h4>
          <p>Debes iniciar sesión para acceder a los pergaminos reales.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container kingdom-slide-up">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4 border-info">
            <div className="card-header bg-info text-white">
              <h1 className="mb-0">
                <i className="fa-solid fa-scroll me-2"></i>
                Pergaminos Reales de {auth.name}
              </h1>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">¡Bienvenido al Scriptorium Real!</h4>
                <p className="mb-0">
                  Aquí puedes redactar pergaminos que serán distribuidos por todo el reino. 
                  Tus mensajes aparecerán en las mazmorras para que otros nobles puedan leerlos.
                </p>
                <hr />
                <p className="mb-0">
                  <strong>Consejo del Escriba:</strong> Redacta con sabiduría, pues tus palabras 
                  perdurarán en los anales del reino.
                </p>
              </div>

              {/* Alert Messages */}
              {error && <KingdomAlert type="error" message={error} />}
              {success && <KingdomAlert type="success" message={success} />}

              {/* New Scroll Button */}
              <div className="mb-4">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowForm(!showForm)}
                  disabled={loading}
                >
                  <i className="fa-solid fa-feather me-2"></i>
                  {showForm ? 'Ocultar Formulario' : 'Redactar Nuevo Pergamino'}
                </button>
              </div>

              {/* Scroll Creation Form */}
              {showForm && (
                <div className="card border-primary mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-pen-fancy me-2"></i>
                      Nuevo Pergamino Real
                    </h5>
                  </div>
                  <div className="card-body">
                    <KingdomForm
                      onSubmit={handleSubmit}
                      onReset={resetForm}
                      submitText="Sellar Pergamino"
                      resetText="Limpiar"
                      loading={loading}
                    >
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="fa-solid fa-scroll me-2"></i>
                              Contenido del Pergamino
                            </label>
                            <textarea
                              className="form-control"
                              name="content"
                              rows="5"
                              placeholder="Escribe tu mensaje aquí..."
                              value={formValues.content}
                              onChange={handleChange}
                              maxLength={500}
                              required
                            />
                            <div className="form-text">
                              {formValues.content.length}/500 caracteres
                            </div>
                          </div>
                        </div>
                      </div>
                    </KingdomForm>
                  </div>
                </div>
              )}

              {/* User's Scrolls */}
              <div className="card border-secondary">
                <div className="card-header bg-secondary text-white">
                  <h5 className="mb-0">
                    <i className="fa-solid fa-list me-2"></i>
                    Mis Pergaminos ({scrolls.length})
                  </h5>
                </div>
                <div className="card-body">
                  {loading && scrolls.length === 0 ? (
                    <div className="text-center">
                      <i className="fa-solid fa-spinner fa-spin fa-2x mb-3"></i>
                      <p>Cargando pergaminos...</p>
                    </div>
                  ) : scrolls.length === 0 ? (
                    <div className="text-center text-muted">
                      <i className="fa-solid fa-scroll fa-3x mb-3"></i>
                      <p>Aún no has redactado ningún pergamino.</p>
                      <p>¡Comienza escribiendo tu primer mensaje!</p>
                    </div>
                  ) : (
                    <div className="row">
                      {scrolls.map((scroll) => (
                        <div key={scroll._id} className="col-md-6 mb-3">
                          <div className="card h-100 border-warning">
                            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                              <h6 className="mb-0 text-truncate me-2">
                                <i className="fa-solid fa-scroll me-1"></i>
                                Pergamino Real
                              </h6>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(scroll._id)}
                                disabled={loading}
                                title="Eliminar pergamino"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                            <div className="card-body">
                              <p className="card-text">{scroll.content}</p>
                              <small className="text-muted">
                                <i className="fa-solid fa-calendar me-1"></i>
                                {new Date(scroll.created_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
