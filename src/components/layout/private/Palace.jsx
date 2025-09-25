import React from "react";
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";

export const Palace = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="kingdom-spinner"></div>
        <p className="kingdom-subtitle mt-3">Esperando palomas mensajeras...</p>
      </div>
    );
  }
  
  if (!auth || !auth.name) {
    navigate("/");
    return null;
  }
  
  return (
    <div className="container kingdom-slide-up">
      <div className="text-center mb-4">
        <h1 className="kingdom-title"> El Palacio Real </h1>
        <p className="kingdom-subtitle">Salón del Trono de El Reino</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h3><i className="fa-solid fa-crown"></i> Bienvenida Real</h3>
            </div>
            <div className="card-body text-center">
              <h4>¡Salve, honorable <span style={{color: 'var(--kingdom-primary)'}}>{auth.name}</span>!</h4>
              <p className="mt-3">
                <i className="fa-solid fa-scepter"></i> Has llegado al corazón de <strong>El Reino</strong>. 
                Desde este palacio, puedes explorar todos los rincones de tu dominio.
              </p>
              
              <div className="row mt-4">
                {/* Mazmorras Card */}
                <div className="col-md-4 mb-3">
                  <div 
                    className="card h-100 kingdom-card-hover" 
                    style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                    onClick={() => navigate('/kingdom/dungeons')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="card-header bg-primary text-white text-center">
                      <i className="fa-solid fa-chess-rook fa-2x mb-2"></i>
                      <h5 className="mb-0"> Las Mazmorras</h5>
                    </div>
                    <div className="card-body text-center">
                      <p className="card-text">
                        Explora las legendarias mazmorras del Reino, donde otros nobles han forjado sus destinos.
                      </p>
                      <div className="mt-3">
                        <span className="badge bg-primary">Aventura</span>
                        <span className="badge bg-secondary ms-1">Exploración</span>
                      </div>
                    </div>
                    <div className="card-footer bg-light">
                      <small className="text-muted">
                        <i className="fa-solid fa-arrow-right me-1"></i>
                        Haz clic para explorar
                      </small>
                    </div>
                  </div>
                </div>

                {/* Calabozo Card */}
                <div className="col-md-4 mb-3">
                  <div 
                    className="card h-100 kingdom-card-hover" 
                    style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                    onClick={() => navigate('/kingdom/dungeon')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="card-header bg-warning text-dark text-center">
                      <i className="fa-solid fa-dungeon fa-2x mb-2"></i>
                      <h5 className="mb-0"> Tu Calabozo</h5>
                    </div>
                    <div className="card-body text-center">
                      <p className="card-text">
                        Accede a tu fortaleza personal, donde puedes revisar tus logros y gestionar tus aventuras.
                      </p>
                      <div className="mt-3">
                        <span className="badge bg-warning text-dark">Personal</span>
                        <span className="badge bg-info ms-1">Estadísticas</span>
                      </div>
                    </div>
                    <div className="card-footer bg-light">
                      <small className="text-muted">
                        <i className="fa-solid fa-arrow-right me-1"></i>
                        Entra a tu refugio
                      </small>
                    </div>
                  </div>
                </div>

                {/* Account Card */}
                <div className="col-md-4 mb-3">
                  <div 
                    className="card h-100 kingdom-card-hover" 
                    style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                    onClick={() => navigate('/kingdom/account')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="card-header bg-success text-white text-center">
                      <i className="fa-solid fa-person-shelter fa-2x mb-2"></i>
                      <h5 className="mb-0"> Registro Real</h5>
                    </div>
                    <div className="card-body text-center">
                      <p className="card-text">
                        Actualiza tu registro en los anales del Reino y personaliza tu perfil de noble.
                      </p>
                      <div className="mt-3">
                        <span className="badge bg-success">Perfil</span>
                        <span className="badge bg-dark ms-1">Configuración</span>
                      </div>
                    </div>
                    <div className="card-footer bg-light">
                      <small className="text-muted">
                        <i className="fa-solid fa-arrow-right me-1"></i>
                        Modifica tu perfil
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Palace Features */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-info" role="alert">
                    <h5 className="alert-heading">
                      <i className="fa-solid fa-info-circle me-2"></i>
                      Anuncios del Reino
                    </h5>
                    <p className="mb-1">
                      <strong> ¡Bienvenido al Reino, Noble {auth.name}!</strong> 
                      Tu aventura comienza aquí. Explora cada rincón, forja alianzas y conviértete en una leyenda.
                    </p>
                    <hr />
                    <p className="mb-0">
                      <i className="fa-solid fa-lightbulb me-1"></i>
                      <strong>Consejo del Sabio:</strong> Visita regularmente tu Calabozo para revisar tus progresos y mantente activo en las Mazmorras para descubrir nuevas oportunidades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
