import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { KingdomLoader, KingdomAlert, KingdomCard } from '../common/KingdomComponents';
import { Follow } from '../follow/Follow';
import { useNavigate } from 'react-router-dom';

export const UserList = ({ page = 1, search = '' }) => {
  const { auth, counters } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    getUsers();
    getFollowing();
  }, [page, search]);

  const getUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const request = await fetch(`${Global.url}user/list/${page}?search=${search}`, {
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
        setError('No se pudieron cargar los nobles del reino');
      }
    } catch (err) {
      setError('Error de conexión con el reino');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <KingdomLoader message="Buscando nobles en el reino..." size="large" />;
  }

  if (error) {
    return (
      <KingdomAlert 
        type="danger" 
        title="¡Error en el reino!" 
        message={error}
        icon="fa-exclamation-triangle" 
      />
    );
  }

  return (
    <div className="container kingdom-fade-in">
      <div className="text-center mb-4">
        <h1 className="kingdom-title">⚔️ Nobles del Reino ⚔️</h1>
        <p className="kingdom-subtitle">Conoce a los habitantes de nuestro reino</p>
      </div>

      {users.length === 0 ? (
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
                        className="kingdom-avatar-large rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="kingdom-avatar-placeholder rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          backgroundColor: 'var(--kingdom-primary)',
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
            Mostrando nobles del reino • Página {page}
          </p>
        </div>
      )}
    </div>
  );
};
