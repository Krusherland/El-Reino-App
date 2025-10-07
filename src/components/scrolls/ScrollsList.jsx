import React, { useState, useEffect } from 'react';
import { ScrollService } from '../../services/ScrollService';
import { useAuth } from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const ScrollsList = ({ maxScrolls = 10, showHeader = true }) => {
  const { auth } = useAuth();
  const [scrolls, setScrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadScrolls();
  }, [currentPage]);

  const loadScrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ScrollService.getAllScrolls(currentPage, maxScrolls);
      setScrolls(response.scrolls || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadScrolls();
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        <h6 className="alert-heading">Error al cargar pergaminos</h6>
        <p className="mb-0">{error}</p>
        <hr />
        <button className="btn btn-sm btn-outline-danger" onClick={handleRefresh}>
          <i className="fa-solid fa-refresh me-1"></i>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="scrolls-list">
      {showHeader && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <i className="fa-solid fa-scroll me-2 text-warning"></i>
            Pergaminos del Reino
          </h5>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            <i className={`fa-solid fa-sync-alt me-1 ${loading ? 'fa-spin' : ''}`}></i>
            Actualizar
          </button>
        </div>
      )}

      {loading && scrolls.length === 0 ? (
        <div className="text-center py-4">
          <i className="fa-solid fa-spinner fa-spin fa-2x mb-3 text-primary"></i>
          <p className="text-muted">Consultando los archivos reales...</p>
        </div>
      ) : scrolls.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="fa-solid fa-scroll fa-3x mb-3"></i>
          <p>No hay pergaminos disponibles en este momento.</p>
          <small>Los nobles aún no han compartido sus pensamientos.</small>
        </div>
      ) : (
        <div className="scrolls-container">
          {scrolls.map((scroll, index) => (
            <div key={scroll._id} className={`card mb-3 border-start border-warning border-3 ${index % 2 === 0 ? 'bg-light' : ''}`}>
              {scroll.image && (
                <img 
                  src={`${Global.url}scroll/media/${scroll.image}`}
                  alt="Scroll image"
                  className="card-img-top"
                  style={{ maxHeight: '400px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={(e) => {
                    // Open image in new tab on click
                    window.open(e.target.src, '_blank');
                  }}
                  title="Click para ver en tamaño completo"
                />
              )}
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0 text-primary">
                    <i className="fa-solid fa-scroll me-2"></i>
                    Pergamino de {scroll.user?.name || 'Noble Anónimo'}
                  </h6>
                  <small className="text-muted">
                    <i className="fa-solid fa-user me-1"></i>
                    {scroll.user?.nickname || scroll.user?.name || 'Noble Anónimo'}
                  </small>
                </div>
                
                <p className="card-text">{scroll.content}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fa-solid fa-calendar me-1"></i>
                    {new Date(scroll.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                  
                  {scroll.user?._id === auth?._id && (
                    <span className="badge bg-success">
                      <i className="fa-solid fa-crown me-1"></i>
                      Tu pergamino
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {scrolls.length === maxScrolls && (
            <div className="text-center">
              <small className="text-muted">
                <i className="fa-solid fa-info-circle me-1"></i>
                Mostrando los {maxScrolls} pergaminos más recientes
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrollsList;