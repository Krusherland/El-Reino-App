import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { KingdomAlert } from "../common/KingdomComponents";

export const Register = () => {
  const { formValues, handleChange, resetForm } = useForm({});
  const [savedUser, setSavedUser] = useState("unsaved");

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = formValues;
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" },
    });
    const data = await request.json();
    if (data.status === "success") {
      setSavedUser("saved");
      resetForm();
    } else {
      setSavedUser("error");
    }
  };

  return (
    <>
      <div className="container kingdom-fade-in">
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <h1 className="kingdom-title"> Ceremonia Real </h1>
              <p className="kingdom-subtitle">Solicitar Nombramiento en El Reino</p>
            </div>

            {/* Success Alert */}
            {savedUser === "saved" && (
              <KingdomAlert 
                type="success" 
                title="🎉 ¡Nombramiento Exitoso!" 
                message="Bienvenido/a a los dominios de El Reino. Tu título ha sido oficialmente otorgado por la Corona Real."
                icon="fa-crown"
              />
            )}

            {/* Error Alert */}
            {savedUser === "error" && (
              <KingdomAlert 
                type="danger" 
                title="⚠️ Nombramiento Fallido" 
                message="Los escribanos reales no pudieron procesar tu solicitud. Por favor, verifica tus datos e intenta nuevamente."
                icon="fa-exclamation-triangle"
              />
            )}

            <div className="card">
              <div className="card-header text-center">
                <h3><i className="fa-solid fa-scroll"></i> Pergamino de Registro Real</h3>
                <small>Complete todos los campos para obtener su título nobiliario</small>
              </div>
              <div className="card-body">
                <form className="register-form" onSubmit={saveUser} onReset={resetForm}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        <i className="fa-solid fa-user"></i> Tu nombre de pila:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Ej: Arturo"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="surname" className="form-label">
                        <i className="fa-solid fa-users"></i> Tu nombre familiar:
                      </label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        className="form-control"
                        placeholder="Ej: de Camelot"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nickname" className="form-label">
                      <i className="fa-solid fa-mask"></i> Tu apodo real:
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      className="form-control"
                      placeholder="Ej: El Valiente"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fa-solid fa-envelope-open-text"></i> Tu dirección de correo real:
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
                      <i className="fa-solid fa-key"></i> Tu palabra secreta:
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Crea una clave digna de la realeza"
                      required
                      onChange={handleChange}
                    />
                    <div className="form-text">
                      <i className="fa-solid fa-info-circle"></i> 
                      Debe ser lo suficientemente fuerte para proteger los secretos del reino
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <button type="submit" className="btn btn-primary w-100 btn-lg">
                        <i className="fa-solid fa-crown"></i> Realizar Nombramiento
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button type="reset" className="btn btn-secondary w-100 btn-lg" onClick={resetForm}>
                        <i className="fa-solid fa-undo"></i> Arrepentirse
                      </button>
                    </div>
                  </div>
                </form>
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
    </>
  );
};
