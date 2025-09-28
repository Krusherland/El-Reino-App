import React, { useState } from 'react'
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useApiError } from "../../hooks/useApiError";
import { Global } from "../../helpers/Global";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { KingdomForm, KingdomInput } from "../common/forms";

export const Login = () => {
  const { formValues, handleChange } = useForm({});
  const { setAuth, authedUser } = useAuth();
  const navigate = useNavigate();
  const { error, loading, handleApiCall, clearError } = useApiError();
  const [success, setSuccess] = useState('');
  
  // Form validation rules
  const validationRules = {
    email: {
      required: 'El email es requerido',
      email: true
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: 6
    }
  };
  
  const { errors, validateForm, handleBlur } = useFormValidation(validationRules);
  
  const loginUser = async (e) => {
    clearError();
    setSuccess('');
    
    // Validate form
    const { isValid } = validateForm(formValues);
    if (!isValid) {
      return;
    }
    
    const result = await handleApiCall(async () => {
      const request = await fetch(Global.url + "user/login", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await request.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'Credenciales inválidas');
      }
      
      return data;
    }, {
      errorMessage: 'Error al iniciar sesión en el reino'
    });
    
    if (result.success) {
      const data = result.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setSuccess('¡Bienvenido al Reino! Redirigiendo...');
      
      // Refresh auth context with complete user data
      await authedUser();
      
      setTimeout(() => {
        navigate("/kingdom/palace");
      }, 1000);
    }
  };
  return (
    <div className="container kingdom-fade-in">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3><i className="fa-solid fa-key"></i> Portal de Entrada</h3>
            </div>
            <div className="card-body">
              <KingdomForm
                title=" El Reino "
                subtitle="Solicitar Acceso a los Dominios Reales"
                onSubmit={loginUser}
                submitText="Entrar al Reino"
                resetButton={false}
                loading={loading}
                error={error}
                success={success}
                validationErrors={errors}
              >
                <KingdomInput
                  label="Tu dirección de correo real:"
                  name="email"
                  type="email"
                  placeholder="tu-correo@reino.com"
                  icon="fa-envelope"
                  required
                  value={formValues.email || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                />
                
                <KingdomInput
                  label="Tu palabra secreta:"
                  name="password"
                  type="password"
                  placeholder="Introduce tu clave secreta"
                  icon="fa-lock"
                  required
                  value={formValues.password || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </KingdomForm>
            </div>
            <div className="card-footer text-center">
              <small>
                <i className="fa-solid fa-shield-halved"></i> 
                Acceso protegido por la Guardia Real
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
