import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useApiError } from "../../hooks/useApiError";
import { Global } from "../../helpers/Global";
import { KingdomForm, KingdomInput } from "../common/forms";

export const Register = () => {
  const { formValues, handleChange, resetForm } = useForm({});
  const { error, loading, handleApiCall, clearError } = useApiError();
  const [success, setSuccess] = useState('');
  
  // Form validation rules
  const validationRules = {
    name: {
      required: 'El nombre es requerido',
      minLength: 2,
      maxLength: 50
    },
    surname: {
      required: 'El apellido es requerido', 
      minLength: 2,
      maxLength: 50
    },
    nickname: {
      required: 'El apodo es requerido',
      minLength: 3,
      maxLength: 20
    },
    email: {
      required: 'El email es requerido',
      email: true
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: 6,
      custom: (value) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
        }
      }
    }
  };
  
  const { errors, validateForm, handleBlur } = useFormValidation(validationRules);

  const saveUser = async (e) => {
    clearError();
    setSuccess('');
    
    // Validate form
    const { isValid } = validateForm(formValues);
    if (!isValid) {
      return;
    }
    
    const result = await handleApiCall(async () => {
      const request = await fetch(Global.url + "user/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await request.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      return data;
    }, {
      errorMessage: 'Error al procesar el nombramiento en el reino'
    });
    
    if (result.success) {
      setSuccess('¡Nombramiento exitoso! Bienvenido/a a los dominios de El Reino.');
      resetForm();
    }
  };
  
  const handleReset = () => {
    resetForm();
    clearError();
    setSuccess('');
  };

  return (
    <div className="container kingdom-fade-in">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header text-center">
              <h3><i className="fa-solid fa-scroll"></i> Pergamino de Registro Real</h3>
              <small>Complete todos los campos para obtener su título nobiliario</small>
            </div>
            <div className="card-body">
              <KingdomForm
                title="⚔️ Ceremonia Real ⚔️"
                subtitle="Solicitar Nombramiento en El Reino"
                onSubmit={saveUser}
                onReset={handleReset}
                submitText="Realizar Nombramiento"
                resetText="Arrepentirse"
                loading={loading}
                error={error}
                success={success}
                validationErrors={errors}
              >
                <div className="row">
                  <div className="col-md-6">
                    <KingdomInput
                      label="Tu nombre de pila:"
                      name="name"
                      placeholder="Ej: Arturo"
                      icon="fa-user"
                      required
                      value={formValues.name || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('name', e.target.value)}
                      error={errors.name}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="col-md-6">
                    <KingdomInput
                      label="Tu nombre familiar:"
                      name="surname"
                      placeholder="Ej: de Camelot"
                      icon="fa-users"
                      required
                      value={formValues.surname || ''}
                      onChange={handleChange}
                      onBlur={(e) => handleBlur('surname', e.target.value)}
                      error={errors.surname}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <KingdomInput
                  label="Tu apodo real:"
                  name="nickname"
                  placeholder="Ej: El Valiente"
                  icon="fa-mask"
                  required
                  value={formValues.nickname || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('nickname', e.target.value)}
                  error={errors.nickname}
                  autoComplete="nickname"
                />

                <KingdomInput
                  label="Tu dirección de correo real:"
                  name="email"
                  type="email"
                  placeholder="tu-correo@reino.com"
                  icon="fa-envelope-open-text"
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
                  placeholder="Crea una clave digna de la realeza"
                  icon="fa-key"
                  required
                  value={formValues.password || ''}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  error={errors.password}
                  helpText="Debe contener al menos 6 caracteres, una mayúscula, una minúscula y un número"
                  autoComplete="new-password"
                />
              </KingdomForm>
            </div>
            <div className="card-footer text-center">
              <small>
                <i className="fa-solid fa-shield-halved"></i> 
                Tu información está protegida por el sello real de El Reino
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
