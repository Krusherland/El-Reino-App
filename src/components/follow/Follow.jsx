import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { KingdomLoader, KingdomAlert, KingdomCard } from '../common/KingdomComponents';

export const Follow = ({ userId, isFollowing: initialFollowing = false }) => {
  const { auth } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleFollow = async () => {
    if (!auth?._id || !token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const request = await fetch(`${Global.url}follow/${endpoint}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      const data = await request.json();
      
      if (data.status === 'success') {
        setIsFollowing(!isFollowing);
      } else {
        setError(data.message || 'Error en la operación');
      }
    } catch (err) {
      setError('Error de conexión con el reino');
    } finally {
      setLoading(false);
    }
  };

  if (!auth?._id || auth._id === userId) {
    return null; // Don't show follow button for self
  }

  return (
    <div className="kingdom-follow-container">
      {error && (
        <KingdomAlert 
          type="danger" 
          title="¡Error en el reino!" 
          message={error} 
        />
      )}
      
      <button 
        className={`btn ${
          isFollowing 
            ? 'btn-outline-secondary kingdom-unfollow-btn' 
            : 'btn-primary kingdom-follow-btn'
        }`}
        onClick={handleFollow}
        disabled={loading}
        title={isFollowing ? 'Dejar de seguir este noble' : 'Seguir a este noble'}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span className="ms-2">Enviando mensaje...</span>
          </>
        ) : isFollowing ? (
          <>
            <i className="fa-solid fa-user-minus"></i>
            <span className="ms-2">Dejar de seguir</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-user-plus"></i>
            <span className="ms-2">Seguir noble</span>
          </>
        )}
      </button>
    </div>
  );
};
