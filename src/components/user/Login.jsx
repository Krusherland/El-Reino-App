import React from 'react'
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { formValues, handleChange} = useForm({});
  const { setAuth, authedUser } = useAuth();
  const navigate = useNavigate();
  
  const loginUser = async (e) => {
    e.preventDefault();
    let userToLogin = formValues;
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: { "Content-Type": "application/json" },
    });
    const data = await request.json();
    
    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Refresh auth context with complete user data
      await authedUser();
      navigate("/kingdom/palace");
    }
  };
  return (
    <div className="container kingdom-fade-in">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <h1 className="kingdom-title"> El Reino </h1>
            <p className="kingdom-subtitle">Solicitar Acceso a los Dominios Reales</p>
          </div>
          
          <div className="card">
            <div className="card-header text-center">
              <h3><i className="fa-solid fa-key"></i> Portal de Entrada</h3>
            </div>
            <div className="card-body">
              <form className='login-form' onSubmit={loginUser}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fa-solid fa-envelope"></i> Tu dirección de correo real:
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="tu-correo@reino.com"
                    required 
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="fa-solid fa-lock"></i> Tu palabra secreta:
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    className="form-control" 
                    placeholder="Introduce tu clave secreta"
                    required 
                    onChange={handleChange}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="fa-solid fa-door-open"></i> Entrar al Reino
                  </button>
                </div>
              </form>
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
