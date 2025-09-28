import React, { useState } from 'react';
import { KingdomAlert } from '../KingdomComponents';

export const KingdomForm = ({ 
  onSubmit, 
  onReset,
  children, 
  className = "", 
  title,
  subtitle,
  resetButton = true,
  submitText = "Enviar",
  resetText = "Resetear",
  loading = false,
  error = null,
  success = null,
  validationErrors = {}
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(e);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (onReset) onReset(e);
  };

  return (
    <div className={`kingdom-form-container ${className}`}>
      {/* Form Header */}
      {(title || subtitle) && (
        <div className="text-center mb-4">
          {title && <h1 className="kingdom-title">{title}</h1>}
          {subtitle && <p className="kingdom-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <KingdomAlert 
          type="success" 
          title="🎉 ¡Éxito!" 
          message={success}
          icon="fa-check-circle"
        />
      )}

      {/* Error Alert */}
      {error && (
        <KingdomAlert 
          type="danger" 
          title="⚠️ Error" 
          message={error}
          icon="fa-exclamation-triangle"
        />
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <KingdomAlert 
          type="warning" 
          title="📋 Errores de Validación" 
          message={
            <ul className="mb-0">
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field}>
                  <strong>{field}:</strong> {message}
                </li>
              ))}
            </ul>
          }
          icon="fa-list-ul"
        />
      )}

      <form onSubmit={handleSubmit} onReset={handleReset} className="kingdom-form">
        {children}
        
        {/* Form Actions */}
        <div className="kingdom-form-actions mt-4">
          <div className="row">
            <div className={resetButton ? "col-md-6 mb-2" : "col-12"}>
              <button 
                type="submit" 
                className="btn btn-primary w-100 btn-lg kingdom-submit-btn"
                disabled={isSubmitting || loading}
              >
                {(isSubmitting || loading) ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span className="ms-2">Procesando...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span className="ms-2">{submitText}</span>
                  </>
                )}
              </button>
            </div>
            {resetButton && (
              <div className="col-md-6">
                <button 
                  type="reset" 
                  className="btn btn-secondary w-100 btn-lg kingdom-reset-btn"
                  disabled={isSubmitting || loading}
                >
                  <i className="fa-solid fa-undo"></i>
                  <span className="ms-2">{resetText}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};