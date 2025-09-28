import Swal from 'sweetalert2';

export class ErrorHandler {
  static showError(error, title = '⚠️ Error en el Reino') {
    let message = 'Ha ocurrido un error inesperado';
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'kingdom-modal',
        title: 'kingdom-title',
        content: 'kingdom-content',
        confirmButton: 'kingdom-confirm-btn'
      },
      background: '#2C1810',
      color: '#D4AF37'
    });
  }

  static showSuccess(message, title = '✅ ¡Éxito!') {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      customClass: {
        popup: 'kingdom-success-modal'
      }
    });
  }

  static showWarning(message, title = '⚠️ Advertencia') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'kingdom-modal',
        confirmButton: 'kingdom-confirm-btn'
      },
      background: '#2C1810',
      color: '#D4AF37'
    });
  }

  static showInfo(message, title = 'ℹ️ Información') {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'kingdom-modal',
        confirmButton: 'kingdom-confirm-btn'
      },
      background: '#2C1810',
      color: '#D4AF37'
    });
  }

  static async confirm(message, title = '¿Estás seguro?') {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8B4513',
      cancelButtonColor: '#6C757D',
      confirmButtonText: '⚔️ Sí, continuar',
      cancelButtonText: '🏰 Cancelar',
      customClass: {
        popup: 'kingdom-modal',
        title: 'kingdom-title',
        content: 'kingdom-content',
        confirmButton: 'kingdom-confirm-btn',
        cancelButton: 'kingdom-cancel-btn'
      },
      background: '#2C1810',
      color: '#D4AF37'
    });

    return result.isConfirmed;
  }

  static logError(error, context = '') {
    const errorInfo = {
      message: error?.message || error,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Application Error:', errorInfo);
    }

    // In production, you might want to send this to a logging service
    // this.sendToLoggingService(errorInfo);
  }

  static handleApiError(error) {
    this.logError(error, 'API_CALL');
    
    if (error?.response?.status === 401) {
      this.showWarning('Tu sesión ha expirado. Serás redirigido al login.', '🔐 Sesión Expirada');
      localStorage.clear();
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    if (error?.response?.status === 403) {
      this.showError('No tienes permisos para realizar esta acción', '🚫 Acceso Denegado');
      return;
    }

    if (error?.response?.status >= 500) {
      this.showError('Error interno del reino. Por favor, intenta más tarde', '🏰 Error del Reino');
      return;
    }

    // Default error handling
    this.showError(error);
  }

  static handleFormValidationErrors(errors) {
    const errorMessages = Object.entries(errors)
      .map(([field, message]) => `• ${field}: ${message}`)
      .join('\n');

    this.showWarning(
      `Por favor, corrige los siguientes errores:\n\n${errorMessages}`,
      '📋 Errores de Validación'
    );
  }

  static handleNetworkError() {
    this.showError(
      'No se pudo conectar con el reino. Verifica tu conexión a internet y vuelve a intentarlo.',
      '🌐 Error de Conexión'
    );
  }

  // Utility method to wrap async operations with error handling
  static async withErrorHandling(asyncOperation, context = '') {
    try {
      return await asyncOperation();
    } catch (error) {
      this.logError(error, context);
      this.handleApiError(error);
      throw error; // Re-throw so calling code can handle if needed
    }
  }
}

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  ErrorHandler.logError(event.error, 'UNCAUGHT_ERROR');
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.logError(event.reason, 'UNHANDLED_PROMISE_REJECTION');
});

export default ErrorHandler;