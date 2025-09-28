import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import { ScrollService } from "../../../services/ScrollService";
import { KingdomForm } from "../../common/forms";
import { KingdomAlert, KingdomCard, KingdomLoader } from "../../common/KingdomComponents";
import { Follow } from "../../follow/Follow";
import { Global } from "../../../helpers/Global";

export const Dungeon = () => {
  const { auth, loading, counters } = useAuth();
  const navigate = useNavigate();
  
  // Scroll functionality
  const [scrolls, setScrolls] = useState([]);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [scrollError, setScrollError] = useState(null);
  const [scrollSuccess, setScrollSuccess] = useState(null);
  const [showScrollForm, setShowScrollForm] = useState(false);
  
  // UserList functionality integrated into Dungeon
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'scrolls', 'nobles'
  const token = localStorage.getItem('token');
  
  const { formValues, handleChange, resetForm } = useForm({
    content: ''
  });

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

  // Load scrolls on component mount
  useEffect(() => {
    if (auth?._id) {
      loadUserScrolls();
    }
  }, [auth]);

  // Load users when nobles tab is active
  useEffect(() => {
    if (activeTab === 'nobles') {
      getUsers();
      getFollowing();
    }
  }, [activeTab]);

  // User functions
  const getUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    
    try {
      const request = await fetch(`${Global.url}user/list/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      const data = await request.json();
      
      if (data.status === 'success') {
        setUsers(data.users || []);
      } else {
        setUsersError('No se pudieron cargar los nobles del reino');
      }
    } catch (err) {
      setUsersError('Error de conexión con el reino');
    } finally {
      setUsersLoading(false);
    }
  };

  const getFollowing = async () => {
    if (!auth?._id || !token) return;
    
    try {
      const request = await fetch(`${Global.url}follow/following/${auth._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      const data = await request.json();
      
      if (data.status === 'success') {
        setFollowing(data.follows?.map(follow => follow.followed) || []);
      }
    } catch (err) {
      console.error('Error loading following list:', err);
    }
  };

  // Scroll functions
  const loadUserScrolls = async () => {
    try {
      setScrollLoading(true);
      const response = await ScrollService.getUserScrolls(auth._id);
      setScrolls(response.scrolls || []);
    } catch (err) {
      setScrollError(err.message);
    } finally {
      setScrollLoading(false);
    }
  };

  const handleScrollSubmit = async (e) => {
    e.preventDefault();
    setScrollError(null);
    setScrollSuccess(null);

    try {
      setScrollLoading(true);
      await ScrollService.createScroll(formValues);
      setScrollSuccess('¡Pergamino creado exitosamente!');
      resetForm();
      setShowScrollForm(false);
      loadUserScrolls();
    } catch (err) {
      setScrollError(err.message);
    } finally {
      setScrollLoading(false);
    }
  };

  const handleScrollDelete = async (scrollId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este pergamino?')) {
      return;
    }

    try {
      setScrollLoading(true);
      await ScrollService.deleteScroll(scrollId);
      setScrollSuccess('Pergamino eliminado exitosamente.');
      loadUserScrolls();
    } catch (err) {
      setScrollError(err.message);
    } finally {
      setScrollLoading(false);
    }
  };

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

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs kingdom-tabs" id="dungeonTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                type="button"
              >
                <i className="fa-solid fa-user-shield me-2"></i>
                Mi Perfil
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'scrolls' ? 'active' : ''}`}
                onClick={() => setActiveTab('scrolls')}
                type="button"
              >
                <i className="fa-solid fa-scroll me-2"></i>
                Mis Pergaminos ({scrolls.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'nobles' ? 'active' : ''}`}
                onClick={() => setActiveTab('nobles')}
                type="button"
              >
                <i className="fa-solid fa-users me-2"></i>
                Nobles del Reino
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content" id="dungeonTabsContent">
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-pane fade show active">
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
                    <div className="fw-bold text-warning">{scrolls.length}</div>
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
              <h3 className="mb-0"> {auth.dungeon || "Mi Fortaleza"}</h3>
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
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => setActiveTab('scrolls')}
                  >
                    <i className="fa-solid fa-scroll me-2"></i>
                    Ver Pergaminos
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => setActiveTab('nobles')}
                  >
                    <i className="fa-solid fa-users me-2"></i>
                    Ver Nobles
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button 
                    className="btn btn-outline-warning w-100"
                    onClick={() => navigate('/kingdom/account')}
                  >
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
        )}

        {/* Scrolls Tab */}
        {activeTab === 'scrolls' && (
          <div className="tab-pane fade show active">
            {/* Quick Create Scroll Button */}
            <div className="row mb-4">
              <div className="col-12">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowScrollForm(!showScrollForm)}
                  disabled={scrollLoading}
                >
                  <i className="fa-solid fa-scroll me-2"></i>
                  {showScrollForm ? 'Ocultar Formulario' : 'Crear Nuevo Pergamino'}
                </button>
              </div>
            </div>

            {/* Scroll Creation Section */}
            {showScrollForm && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="fa-solid fa-pen-fancy me-2"></i>
                        Redactar Nuevo Pergamino
                      </h5>
                    </div>
                    <div className="card-body">
                      {scrollError && <KingdomAlert type="error" message={scrollError} />}
                      {scrollSuccess && <KingdomAlert type="success" message={scrollSuccess} />}
                      
                      <KingdomForm
                        onSubmit={handleScrollSubmit}
                        onReset={resetForm}
                        submitText="Sellar Pergamino"
                        resetText="Limpiar"
                        loading={scrollLoading}
                      >
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="fa-solid fa-scroll me-2"></i>
                            Contenido del Pergamino
                          </label>
                          <textarea
                            className="form-control"
                            name="content"
                            rows="4"
                            placeholder="Escribe tu mensaje aquí..."
                            value={formValues.content}
                            onChange={handleChange}
                            maxLength={500}
                            required
                          />
                          <div className="form-text">
                            {formValues.content?.length || 0}/500 caracteres
                          </div>
                        </div>
                      </KingdomForm>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User's Scrolls Section */}
            <div className="row">
              <div className="col-12">
                <div className="card border-info">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-scroll me-2"></i>
                      Mis Pergaminos ({scrolls.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    {scrollLoading && scrolls.length === 0 ? (
                      <div className="text-center">
                        <i className="fa-solid fa-spinner fa-spin fa-2x mb-3"></i>
                        <p>Cargando pergaminos...</p>
                      </div>
                    ) : scrolls.length === 0 ? (
                      <div className="text-center text-muted">
                        <i className="fa-solid fa-scroll fa-3x mb-3"></i>
                        <p>Aún no has redactado ningún pergamino.</p>
                        <p>¡Usa el botón "Crear Pergamino" para comenzar!</p>
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
                                  onClick={() => handleScrollDelete(scroll._id)}
                                  disabled={scrollLoading}
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
        )}

        {/* Nobles Tab */}
        {activeTab === 'nobles' && (
          <div className="tab-pane fade show active">
            <div className="text-center mb-4">
              <h2 className="kingdom-title">⚔️ Nobles del Reino ⚔️</h2>
              <p className="kingdom-subtitle">Conoce a los habitantes de nuestro reino</p>
            </div>

            {usersLoading ? (
              <KingdomLoader message="Buscando nobles en el reino..." size="large" />
            ) : usersError ? (
              <KingdomAlert 
                type="danger" 
                title="¡Error en el reino!" 
                message={usersError}
                icon="fa-exclamation-triangle" 
              />
            ) : users.length === 0 ? (
              <KingdomAlert 
                type="info" 
                title="Reino desierto" 
                message="No se encontraron nobles en el reino en este momento"
                icon="fa-users" 
              />
            ) : (
              <div className="row">
                {users.map(user => (
                  <div key={user._id} className="col-lg-4 col-md-6 mb-4">
                    <KingdomCard 
                      title={
                        <>
                          <i className="fa-solid fa-crown"></i>
                          {user.name} {user.surname}
                        </>
                      }
                      headerClass="text-center kingdom-gradient"
                    >
                      <div className="text-center">
                        <div className="mb-3">
                          {user.image && user.image !== 'default.png' ? (
                            <img 
                              src={`${Global.url}user/avatar/${user.image}`}
                              alt={`Avatar de ${user.name}`}
                              className="rounded-circle"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                backgroundColor: 'var(--kingdom-primary, #007bff)',
                                color: 'white',
                                fontSize: '2rem',
                                margin: '0 auto'
                              }}
                            >
                              <i className="fa-solid fa-user"></i>
                            </div>
                          )}
                        </div>
                        
                        <h6 className="card-subtitle mb-2 text-muted">
                          <i className="fa-solid fa-at"></i> {user.nick}
                        </h6>
                        
                        {user.bio && (
                          <p className="card-text small">
                            <i className="fa-solid fa-scroll"></i> {user.bio}
                          </p>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate(`/kingdom/profile/${user._id}`)}
                            title="Ver perfil completo"
                          >
                            <i className="fa-solid fa-eye"></i>
                            <span className="ms-1">Ver perfil</span>
                          </button>
                          
                          <Follow 
                            userId={user._id}
                            isFollowing={following.includes(user._id)}
                          />
                        </div>
                      </div>
                    </KingdomCard>
                  </div>
                ))}
              </div>
            )}
            
            {users.length > 0 && (
              <div className="text-center mt-4">
                <p className="kingdom-subtitle">
                  <i className="fa-solid fa-users"></i> 
                  Mostrando nobles del reino
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
