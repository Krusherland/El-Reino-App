import React from 'react';

export const KingdomLoader = ({ message = "Cargando...", size = "medium" }) => {
  const sizeClasses = {
    small: "30px",
    medium: "50px", 
    large: "70px"
  };

  const spinnerStyle = {
    width: sizeClasses[size],
    height: sizeClasses[size]
  };

  return (
    <div className="text-center my-5">
      <div className="kingdom-spinner" style={spinnerStyle}></div>
      <p className="kingdom-subtitle mt-3">
        <i className="fa-solid fa-hourglass-half"></i> {message}
      </p>
    </div>
  );
};

export const KingdomAlert = ({ type = "info", title, message, icon }) => {
  const alertTypes = {
    success: { class: "alert-success", defaultIcon: "fa-check-circle" },
    danger: { class: "alert-danger", defaultIcon: "fa-exclamation-triangle" },
    warning: { class: "alert-warning", defaultIcon: "fa-exclamation-circle" },
    info: { class: "alert-info", defaultIcon: "fa-info-circle" }
  };

  const alertConfig = alertTypes[type] || alertTypes.info;
  const displayIcon = icon || alertConfig.defaultIcon;

  return (
    <div className={`alert ${alertConfig.class} kingdom-fade-in`} role="alert">
      <h6>
        <i className={`fa-solid ${displayIcon}`}></i> {title}
      </h6>
      {message && <p className="mb-0">{message}</p>}
    </div>
  );
};

export const KingdomCard = ({ title, children, icon, headerClass = "" }) => {
  return (
    <div className="card kingdom-slide-up">
      {title && (
        <div className={`card-header ${headerClass}`}>
          <h5 className="mb-0">
            {icon && <i className={`fa-solid ${icon}`}></i>} {title}
          </h5>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};