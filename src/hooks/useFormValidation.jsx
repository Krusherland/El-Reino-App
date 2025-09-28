import { useState } from 'react';

export const useFormValidation = (validationRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Check if field is required
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.required === true ? 'Este campo es requerido' : rules.required;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return '';
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Debe tener al menos ${rules.minLength} caracteres`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `No puede exceder ${rules.maxLength} caracteres`;
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Ingresa un email válido';
      }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || 'Formato inválido';
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const validateSingleField = (name, value) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return error;
  };

  const handleBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateSingleField(name, value);
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
  };

  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    handleBlur,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};