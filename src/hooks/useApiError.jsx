import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = useCallback(async (apiFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      showLoading = true,
      errorMessage = 'Ha ocurrido un error inesperado'
    } = options;

    if (showLoading) setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error('API Error:', err);
      
      let errorMsg = errorMessage;
      
      // Handle different error types
      if (err.response) {
        // Server responded with error status
        const { status, data } = err.response;
        
        switch (status) {
          case 400:
            errorMsg = data.message || 'Datos inválidos enviados al reino';
            break;
          case 401:
            errorMsg = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
            localStorage.clear();
            window.location.href = '/login';
            break;
          case 403:
            errorMsg = 'No tienes permisos para realizar esta acción';
            break;
          case 404:
            errorMsg = 'El recurso solicitado no fue encontrado';
            break;
          case 422:
            errorMsg = data.message || 'Datos de validación incorrectos';
            break;
          case 500:
            errorMsg = 'Error interno del reino. Por favor, intenta más tarde';
            break;
          default:
            errorMsg = data.message || `Error del servidor (${status})`;
        }
      } else if (err.request) {
        // Network error
        errorMsg = 'Error de conexión con el reino. Verifica tu conexión a internet';
      } else if (err.message) {
        // Other errors
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      
      if (onError) {
        onError(err, errorMsg);
      }
      
      return { success: false, error: errorMsg };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setCustomError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  return {
    error,
    loading,
    handleApiCall,
    clearError,
    setCustomError
  };
};