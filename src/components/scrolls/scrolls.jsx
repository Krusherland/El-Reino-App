import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { ScrollService } from '../../services/ScrollService';
import { KingdomForm, KingdomInput } from '../common/forms';
import { KingdomAlert } from '../common/KingdomComponents';
import { Global } from '../../helpers/Global';
import Swal from 'sweetalert2';

export const Scrolls = () => {
  const { auth } = useAuth();
  const [scrolls, setScrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('scrollImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      
      // Use createScrollWithImage if there's an image, otherwise use createScroll
      if (selectedImage) {
        await ScrollService.createScrollWithImage(formValues, selectedImage);
      } else {
        await ScrollService.createScroll(formValues);
      }
      
      setSuccess('¡Pergamino creado exitosamente! Tu mensaje será visible en las mazmorras.');
      resetForm();
      handleRemoveImage(); // Clear image state
      setShowForm(false);
      loadUserScrolls(); // Reload user scrolls
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scrollId) => {
    Swal.fire({
      title: '¿Destruir este pergamino real?',
      html: `
        <p style="font-size: 1rem; line-height: 1.6; color: #D4AF37;">
          Esta acción es <strong>irreversible</strong> y el documento será consumido por las llamas del olvido, 
          desapareciendo para siempre de los archivos reales.
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B0000',
      cancelButtonColor: '#6C757D',
      confirmButtonText: '🔥 Destruir Pergamino',
      cancelButtonText: '🛡️ Conservar',
      reverseButtons: true,
      background: '#2C1810',
      color: '#D4AF37',
      customClass: {
        popup: 'kingdom-modal',
        title: 'kingdom-title',
        htmlContainer: 'kingdom-content',
        confirmButton: 'kingdom-confirm-btn',
        cancelButton: 'kingdom-cancel-btn'
      },
      backdrop: `
        rgba(139, 69, 19, 0.7)
        url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23D4AF37' fill-opacity='0.1' fill-rule='nonzero'%3e%3cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")
        left top
        repeat
      `,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await ScrollService.deleteScroll(scrollId);
          
          Swal.fire({
            title: '¡Pergamino Destruido!',
            html: `
              <p style="font-size: 1rem; color: #52B788;">
                El pergamino ha sido consumido por las llamas y removido de los archivos reales.
              </p>
            `,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            background: '#1B4332',
            color: '#D4AF37',
            iconColor: '#52B788',
            customClass: {
              popup: 'kingdom-success-modal',
              title: 'kingdom-success-title'
            },
            showClass: {
              popup: 'animate__animated animate__bounceIn'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOut'
            }
          });
          
          setSuccess('Pergamino destruido exitosamente.');
          loadUserScrolls();
        } catch (err) {
          setError(err.message);
          
          Swal.fire({
            title: 'Error en el Reino',
            text: err.message,
            icon: 'error',
            confirmButtonColor: '#8B4513',
            background: '#2C1810',
            color: '#D4AF37',
            customClass: {
              popup: 'kingdom-modal',
              confirmButton: 'kingdom-confirm-btn'
            }
          });
        } finally {
          setLoading(false);
        }
      }
    });
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

                          <div className="mb-3">
                            <label className="form-label">
                              <i className="fa-solid fa-image me-2"></i>
                              Imagen del Pergamino (Opcional)
                            </label>
                            <input
                              id="scrollImageInput"
                              type="file"
                              className="form-control"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={handleImageChange}
                              disabled={loading}
                            />
                            <div className="form-text">
                              <i className="fa-solid fa-info-circle me-1"></i>
                              Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
                            </div>
                          </div>

                          {imagePreview && (
                            <div className="mb-3">
                              <label className="form-label">
                                <i className="fa-solid fa-eye me-2"></i>
                                Vista Previa
                              </label>
                              <div className="position-relative d-inline-block">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="img-fluid rounded border"
                                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                  onClick={handleRemoveImage}
                                  disabled={loading}
                                  title="Eliminar imagen"
                                >
                                  <i className="fa-solid fa-times"></i>
                                </button>
                              </div>
                            </div>
                          )}
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
                            {scroll.image && (
                              <img 
                                src={`${Global.url}scroll/media/${scroll.image}`}
                                alt="Scroll image"
                                className="card-img-top"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                              />
                            )}
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
