import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import Swal from 'sweetalert2';

export const UnifiedNav = ({ isPrivate = false }) => {
  const { auth, setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  const handleLogoutConfirmation = () => {
    Swal.fire({
      title: '¿Estás seguro de que quieres salir del Reino?',
      text: "Se cerrará tu calabozo",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8B4513', // Brown color for kingdom theme
      cancelButtonColor: '#6C757D', // Gray color
      confirmButtonText: '⚔️ Deseo marchar',
      cancelButtonText: '🏰 Arrepentirse',
      reverseButtons: true,
      // Custom styling options
      background: '#2C1810', // Dark brown background
      color: '#D4AF37', // Gold text color
      customClass: {
        popup: 'kingdom-modal',
        title: 'kingdom-title',
        content: 'kingdom-content',
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
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear user data and logout
        localStorage.clear();
        setAuth({});
        setCounters({});
        
        // Show success message
        Swal.fire({
          title: ' ¡Partida Honor​able del Reino! ',
          text: 'Has abandonado el Reino con gloria. Que los vientos te guíen en tu travesía, noble aventurero. Tu calabozo permanecerá sellado hasta tu regreso.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          background: '#1B4332', // Dark green background
          color: '#D4AF37', // Gold text
          iconColor: '#52B788', // Green icon
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
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to={isPrivate ? "/kingdom/palace" : "/"}>
          <i className="fa-brands fa-fort-awesome-alt"></i>
          El Reino
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {isPrivate && auth?.name ? (
              // Private navigation for authenticated users
              <>
                <NavLink className="nav-link" to="/kingdom/palace">
                  <i className="fa-brands fa-fort-awesome"></i>
                  Palacio
                </NavLink>
                <NavLink className="nav-link" to="/kingdom/dungeons">
                  <i className="fa-solid fa-chess-rook"></i>
                  Mazmorras
                </NavLink>
                <NavLink className="nav-link" to="/kingdom/dungeon">
                  <i className="fa-solid fa-dungeon"></i>
                  Calabozo
                </NavLink>
                <NavLink className="nav-link" to="/kingdom/users">
                  <i className="fa-solid fa-users"></i>
                  Nobles
                </NavLink>
                <NavLink className="nav-link" to="/kingdom/account">
                  <i className="fa-solid fa-person-shelter"></i>
                  {auth.name}
                </NavLink>
                <button 
                  className="nav-link btn btn-link" 
                  onClick={handleLogoutConfirmation}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    textDecoration: 'none',
                    color: 'var(--kingdom-light)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '500',
                    margin: '0 0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.6rem 1rem',
                    transition: 'var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--gradient-primary)';
                    e.target.style.color = 'white';
                    e.target.style.textShadow = 'var(--text-shadow-sm)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--kingdom-light)';
                    e.target.style.textShadow = 'none';
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fa-solid fa-door-open"></i>
                  Salir
                </button>
              </>
            ) : (
              // Public navigation for guests
              <>
                <NavLink className="nav-link" to="/login">
                  <i className="fa-solid fa-torii-gate"></i>
                  Entrar
                </NavLink>
                <NavLink className="nav-link" to="/register">
                  <i className="fa-solid fa-feather"></i>
                  Nombramiento
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};