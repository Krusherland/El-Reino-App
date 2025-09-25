import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Dungeon = () => {
  const { auth, loading, counters } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3"> Los pergaminos se están desenrollando...</p>
      </div>
    );
  }

  if (!auth || !auth.name) {
    navigate("/");
    return null;
  }

  // Check if we have the essential data loaded
  const hasCompleteData = auth.name && counters.following !== undefined;

  return (
    <div className="container kingdom-slide-up">
      <div className="row">
        <div className="col-12">
          <div className="alert alert-dark mb-4" role="alert">
            <h1 className="alert-heading">🗝️ Tu Calabozo Personal</h1>
            <p className="mb-0">
              <strong>¡Bienvenido a tu fortaleza, Noble {auth.name}!</strong> 
              Este es tu dominio privado en el Reino, donde puedes contemplar tus logros, 
              gestionar tus alianzas y planificar tus próximas aventuras.
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Perfil del Noble */}
        <div className="col-lg-6 mb-4">
          <div className="card border-primary h-100">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0"> Perfil del Noble</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <i className="fa-solid fa-user-crown fa-4x text-primary mb-2"></i>
                <h4 className="text-primary">{auth.name}</h4>
              </div>
              
              <div className="row">
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">⚔️ Nombre de Guerra:</label>
                    <p className="text-muted">{auth.nickname || "Sin nombre de guerra"}</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">🏰 Posición:</label>
                    <p className="text-muted">{auth.role || "Plebeyo"}</p>
                  </div>
                </div>
              </div>

              <div className="row text-center">
                <div className="col-4">
                  <div className="border rounded p-2">
                    <i className="fa-solid fa-handshake text-success"></i>
                    <div className="fw-bold text-success">{counters.following !== undefined ? counters.following : 0}</div>
                    <small className="text-muted">Aliados</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2">
                    <i className="fa-solid fa-users text-info"></i>
                    <div className="fw-bold text-info">{counters.followed !== undefined ? counters.followed : 0}</div>
                    <small className="text-muted">Admiradores</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2">
                    <i className="fa-solid fa-scroll text-warning"></i>
                    <div className="fw-bold text-warning">{counters.publications !== undefined ? counters.publications : 0}</div>
                    <small className="text-muted">Pergaminos</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Calabozo */}
        <div className="col-lg-6 mb-4">
          <div className="card border-warning h-100">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">🏰 {auth.dungeon || "Mi Fortaleza"}</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <i className="fa-solid fa-dungeon fa-4x text-warning mb-2"></i>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">📜 Historia del Calabozo:</label>
                <div className="border rounded p-3 bg-light">
                  <p className="mb-0" style={{fontSize: '0.95rem', lineHeight: '1.6'}}>
                    {auth.bio || "Este noble calabozo aún aguarda por que su señor escriba su historia. Las piedras susurran secretos antiguos, pero las páginas permanecen en blanco, esperando ser llenadas con las hazañas y aventuras de su dueño."}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  💡 <strong>Consejo:</strong> Actualiza tu historia en el Registro Real para que otros nobles conozcan tus hazañas.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Acciones Rápidas */}
      <div className="row">
        <div className="col-12">
          <div className="card border-secondary">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">⚡ Acciones Rápidas del Calabozo</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-primary w-100">
                    <i className="fa-solid fa-scroll me-2"></i>
                    Crear Pergamino
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-success w-100">
                    <i className="fa-solid fa-users me-2"></i>
                    Buscar Aliados
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-warning w-100">
                    <i className="fa-solid fa-cog me-2"></i>
                    Configurar
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-info w-100">
                    <i className="fa-solid fa-chart-line me-2"></i>
                    Estadísticas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
