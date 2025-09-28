import React, { useState } from 'react';

export const KingdomInput = ({ 
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  value,
  defaultValue,
  onChange,
  icon,
  helpText,
  error,
  className = "",
  disabled = false,
  autoComplete,
  rows, // For textarea
  options = [], // For select
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  
  const inputId = `kingdom-input-${name}`;
  const inputClasses = `form-control ${hasError ? 'is-invalid' : ''} ${className}`;

  const renderInput = () => {
    // Textarea
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          rows={rows || 4}
          {...props}
        />
      );
    }

    // Select dropdown
    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          className={inputClasses}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          <option value="">{placeholder || "Seleccionar..."}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      );
    }

    // Password with toggle
    if (type === 'password') {
      return (
        <div className="input-group">
          <input
            id={inputId}
            name={name}
            type={showPassword ? 'text' : 'password'}
            className={inputClasses}
            placeholder={placeholder}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            {...props}
          />
          <button
            className="btn btn-outline-secondary kingdom-password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>
      );
    }

    // Regular input
    return (
      <input
        id={inputId}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        {...props}
      />
    );
  };

  return (
    <div className="kingdom-input-group mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label kingdom-label">
          {icon && <i className={`fa-solid ${icon}`}></i>} {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {/* Help text */}
      {helpText && !hasError && (
        <div className="form-text kingdom-help-text">
          <i className="fa-solid fa-info-circle"></i> {helpText}
        </div>
      )}
      
      {/* Error message */}
      {hasError && (
        <div className="invalid-feedback kingdom-error-text">
          <i className="fa-solid fa-exclamation-triangle"></i> {error}
        </div>
      )}
    </div>
  );
};