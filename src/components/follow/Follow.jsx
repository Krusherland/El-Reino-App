import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApiError } from '../../hooks/useApiError';
import { SocialService } from '../../services/SocialService';
import { KingdomAlert } from '../common/KingdomComponents';
import Swal from 'sweetalert2';

export const Follow = ({ userId, isFollowing: initialFollowing = false, onFollowChange }) => {
  const { auth } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const { error, loading, handleApiCall, clearError } = useApiError();
  const [showError, setShowError] = useState(false);
  const token = localStorage.getItem('token');

  // Update local state when prop changes
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing, userId]);

  const handleFollow = async () => {
    if (!auth?._id || !token) {
      Swal.fire({
        title: '⚠️ Acceso Denegado',
        text: 'Debes iniciar sesión para seguir a otros nobles',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'kingdom-modal',
          confirmButton: 'kingdom-confirm-btn'
        }
      });
      return;
    }
    
    clearError();
    setShowError(false);
    
    const action = isFollowing ? 'dejar de seguir' : 'seguir';
    
    const result = await handleApiCall(async () => {
      // Use the proper service layer instead of raw fetch
      if (isFollowing) {
        return await SocialService.unfollowUser(userId);
      } else {
        return await SocialService.followUser(userId);
      }
    }, {
      errorMessage: `Error al ${action} al noble`,
      showLoading: false
    });
    
    if (result.success) {
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      
      // Notify parent component of the change
      if (onFollowChange) {
        onFollowChange(userId, newFollowingState);
      }
      
      // Show success notification
      const successMessage = isFollowing 
        ? '👋 Has dejado de seguir a este noble' 
        : '🤝 ¡Ahora sigues a este noble!';
        
      Swal.fire({
        title: '✅ ¡Éxito!',
        text: successMessage,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'kingdom-success-modal'
        }
      });
    } else {
      setShowError(true);
    }
  };

  // Don't show follow button for self or if user is not authenticated
  if (!auth?._id || auth._id === userId) {
    return null;
  }

  return (
    <div className="kingdom-follow-container">
      {error && showError && (
        <div className="mb-2">
          <KingdomAlert 
            type="danger" 
            title="¡Error en el reino!" 
            message={error}
          />
        </div>
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
        aria-label={isFollowing ? 'Dejar de seguir' : 'Seguir'}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            <span className="ms-2">
              {isFollowing ? 'Dejando de seguir...' : 'Siguiendo...'}
            </span>
          </>
        ) : isFollowing ? (
          <>
            <i className="fa-solid fa-user-minus" aria-hidden="true"></i>
            <span className="ms-2">Dejar de seguir</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
            <span className="ms-2">Seguir noble</span>
          </>
        )}
      </button>
    </div>
  );
};
