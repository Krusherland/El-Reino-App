import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useApiError } from '../../hooks/useApiError';
import { KingdomForm, KingdomInput } from '../common/forms';
import ErrorHandler from '../../helpers/ErrorHandler';

export const DemoForm = () => {
  const { formValues, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    role: '',
    bio: '',
    terms: false
  });

  const { error, loading, handleApiCall, clearError } = useApiError();
  const [success, setSuccess] = useState('');

  // Comprehensive validation rules showcase
  const validationRules = {
    name: {
      required: 'El nombre es requerido',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      patternMessage: 'Solo se permiten letras y espacios'
    },
    email: {
      required: 'El email es requerido',
      email: true,
      custom: (value) => {
        if (value && value.includes('test@')) {
          return 'No se permiten emails de prueba';
        }
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: 8,
      custom: (value) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          return 'Debe contener mayúscula, minúscula, número y símbolo especial';
        }
      }
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      custom: (value) => {
        if (value !== formValues.password) {
          return 'Las contraseñas no coinciden';
        }
      }
    },
    age: {
      required: 'La edad es requerida',
      custom: (value) => {
        const age = parseInt(value);
        if (isNaN(age) || age < 13 || age > 120) {
          return 'La edad debe estar entre 13 y 120 años';
        }
      }
    },
    role: {
      required: 'Selecciona un rol'
    },
    bio: {
      maxLength: 500,
      custom: (value) => {
        if (value && value.length > 0 && value.length < 10) {
          return 'La biografía debe tener al menos 10 caracteres';
        }
      }
    }
  };

  const { errors, validateForm, handleBlur, clearErrors } = useFormValidation(validationRules);

  const roleOptions = [
    { value: 'knight', label: '⚔️ Caballero' },
    { value: 'mage', label: '🧙‍♂️ Mago' },
    { value: 'archer', label: '🏹 Arquero' },
    { value: 'merchant', label: '💰 Comerciante' },
    { value: 'noble', label: '👑 Noble' }
  ];

  const handleSubmit = async (e) => {
    clearError();
    setSuccess('');

    // Validate form
    const { isValid, errors: validationErrors } = validateForm(formValues);
    if (!isValid) {
      ErrorHandler.handleFormValidationErrors(validationErrors);
      return;
    }

    // Simulate API call
    const result = await handleApiCall(async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.3) {
        return { message: 'Formulario enviado exitosamente' };
      } else {
        throw new Error('Error simulado del servidor');
      }
    }, {
      errorMessage: 'Error al enviar el formulario de demo'
    });

    if (result.success) {
      setSuccess('¡Formulario de demo enviado exitosamente! Todos los campos fueron validados correctamente.');
      ErrorHandler.showSuccess('¡Formulario procesado correctamente!');
      
      // Reset form after success
      setTimeout(() => {
        handleReset();
      }, 3000);
    }
  };

  const handleReset = () => {
    resetForm();
    clearError();
    clearErrors();
    setSuccess('');
  };

  return (
    <div className="container kingdom-fade-in">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header text-center">
              <h3><i className="fa-solid fa-magic"></i> Formulario de Demostración Avanzado</h3>
              <small>Showcasing Enhanced Form Components & Error Handling</small>
            </div>
            <div className="card-body">
              <KingdomForm
                title="🧪 Demo de Validación Avanzada"
                subtitle="Prueba todas las características de los formularios mejorados"
                onSubmit={handleSubmit}
                onReset={handleReset}
                submitText="Enviar Demo"
                resetText="Limpiar Todo"
                loading={loading}
                error={error}
                success={success}
                validationErrors={errors}
              >
                <div className="row">
                  <div className="col-md-6">
                    <KingdomInput
                      label="Nombre Completo"
                      name="name"
                      placeholder="Ej: Juan Pérez"
                      icon="fa-user"
                      required
                      value={formValues.name || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('name', e.target.value)}
                      error={errors.name}
                      helpText="Solo letras y espacios, 2-50 caracteres"
                      autoComplete="name"
                    />
                  </div>
                  <div className="col-md-6">
                    <KingdomInput
                      label="Edad"
                      name="age"
                      type="number"
                      placeholder="Ej: 25"
                      icon="fa-calendar"
                      required
                      value={formValues.age || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('age', e.target.value)}
                      error={errors.age}
                      min="13"
                      max="120"
                    />
                  </div>
                </div>

                <KingdomInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="tu-email@reino.com"
                  icon="fa-envelope"
                  required
                  value={formValues.email || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  error={errors.email}
                  helpText="No usar emails de prueba (test@...)"
                  autoComplete="email"
                />

                <div className="row">
                  <div className="col-md-6">
                    <KingdomInput
                      label="Contraseña"
                      name="password"
                      type="password"
                      placeholder="Contraseña segura"
                      icon="fa-lock"
                      required
                      value={formValues.password || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('password', e.target.value)}
                      error={errors.password}
                      helpText="Min 8 chars: mayúscula, minúscula, número, símbolo"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="col-md-6">
                    <KingdomInput
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repite la contraseña"
                      icon="fa-check-circle"
                      required
                      value={formValues.confirmPassword || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <KingdomInput
                  label="Rol en el Reino"
                  name="role"
                  type="select"
                  placeholder="Selecciona tu rol..."
                  icon="fa-shield"
                  required
                  value={formValues.role || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('role', e.target.value)}
                  error={errors.role}
                  options={roleOptions}
                />

                <KingdomInput
                  label="Biografía (Opcional)"
                  name="bio"
                  type="textarea"
                  placeholder="Cuéntanos tu historia..."
                  icon="fa-scroll"
                  value={formValues.bio || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('bio', e.target.value)}
                  error={errors.bio}
                  rows={4}
                  helpText="Máximo 500 caracteres, mínimo 10 si completas"
                />
              </KingdomForm>
            </div>
            <div className="card-footer">
              <div className="text-center">
                <small className="text-muted">
                  <i className="fa-solid fa-info-circle"></i>
                  Este formulario demuestra validación en tiempo real, manejo de errores mejorado, 
                  y componentes reutilizables. Prueba diferentes combinaciones para ver todas las validaciones.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};