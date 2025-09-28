import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Global } from "../../../helpers/Global";
import { useState } from "react";
import { SerializeForm } from "../../../helpers/SerializeForm.jsx";

export const Account = () => {
  const { auth, loading, setAuth } = useAuth();
  const navigate = useNavigate();
  const [savedUser, setSavedUser] = useState("unsaved");

  const updateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let updatedUser = SerializeForm(e.target);
    delete updatedUser.file;

    try {
      const request = await fetch(Global.url + "user/update", {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();

      if (data.status === "success") {
        delete data.user.password;
        setAuth(data.user);
        setSavedUser("saved");
      } else {
        setSavedUser("error");
      }
    } catch (error) {
      setSavedUser("error");
    }
    const fileInput = document.querySelector("#file");
    if (fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: token },
      });
      const uploadData = await uploadRequest.json();
      if (uploadData.status === "success") {
        let userUpdated = uploadData.user;
        delete userUpdated.password;
        setAuth(userUpdated);
        localStorage.setItem("user", JSON.stringify(userUpdated));
        setSavedUser("saved");
      } else {
        setSavedUser("error");
      }
    }
  };

  const resetForm = () => {
    setSavedUser("unsaved");
  };

  if (loading) {
    return <div>Esperando palomas mensajeras...</div>;
  }

  if (!auth || !auth.name) {
    navigate("/");
    return null;
  }

  return (
    <div className="container kingdom-slide-up">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <div className="card kingdom-card">
            <div className="card-header text-center">
              <h1 className="mb-0">
                <i className="fa-brands fa-fort-awesome-alt"></i> Registro del Noble en el Reino
              </h1>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Kingdom Logo Side */}
                <div className="col-md-4 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                  <div className="text-center kingdom-logo-section">
                    <img 
                      src="/src/assets/kingdom-logo2.png" 
                      alt="Reino Logo" 
                      className="img-fluid kingdom-logo mb-3"
                      style={{
                        maxWidth: "200px",
                        height: "auto"
                      }}
                    />
                    <p className="text-muted small">
                       El Reino Eterno
                    </p>
                  </div>
                </div>
                
                {/* Form Side */}
                <div className="col-md-8">
                  {savedUser == "saved" ? (
                    <div className="alert alert-success" role="alert">
                      <strong>
                         ¡Tu registro en los libros del Reino ha sido actualizado con
                        éxito!
                      </strong>
                      <br />
                      <small>
                        Los escribas reales han documentado tus nuevos datos con tinta
                        dorada.
                      </small>
                    </div>
                  ) : (
                    ""
                  )}

                  {savedUser == "error" ? (
                    <div className="alert alert-danger" role="alert">
                      <strong>🛡️ Los pergaminos se han manchado...</strong>
                      <br />
                      <small>
                        Ha ocurrido un error al actualizar tu registro en los archivos del
                        Reino. Por favor, inténtalo de nuevo.
                      </small>
                    </div>
                  ) : (
                    ""
                  )}
                  
                  <form className="account-form" onSubmit={updateUser} onReset={resetForm}>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            🎭 Retrato Real
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control"
            defaultValue={auth.avatar}
          />
          <div className="form-text">
            Sube tu retrato oficial para los archivos del Reino
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            👑 Tu Nombre de Pila:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Nombre que te dieron al nacer..."
            required
            defaultValue={auth.name}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="surname" className="form-label">
            🏰 Tu Linaje Familiar:
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            className="form-control"
            placeholder="Apellido de tu noble casa..."
            required
            defaultValue={auth.surname}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nickname" className="form-label">
            ⚔️ Tu Nombre de Guerra:
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            className="form-control"
            placeholder="Como te conocen en las batallas..."
            required
            defaultValue={auth.nickname}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dungeon" className="form-label">
            🗝️ Nombre de tu Calabozo:
          </label>
          <input
            type="text"
            id="dungeon"
            name="dungeon"
            className="form-control"
            placeholder="El nombre de tu fortaleza personal..."
            required
            defaultValue={auth.dungeon}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            📜 Tu Historia Personal:
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-control"
            rows="4"
            placeholder="Narra tu historia, noble aventurero... Tus hazañas, origen y ambiciones en el Reino..."
            required
            defaultValue={auth.bio}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            🕊️ Tu Paloma Mensajera (Email):
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="direccion@paloma-mensajera.reino"
            required
            defaultValue={auth.email}
          />
          <div className="form-text">
            Dirección para recibir decretos reales y comunicaciones oficiales
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            🗝️ Tu Palabra Secreta:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="La clave secreta de tu calabozo..."
            required
          />
          <div className="form-text">
            Confirma tu identidad con la palabra secreta de tu calabozo
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            👨‍💼 Tu Posición en el Reino:
          </label>
          <input
            type="text"
            id="role"
            name="role"
            className="form-control"
            placeholder="Caballero, Mago, Comerciante, Plebeyo..."
            required
            defaultValue={auth.role}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">
            🖼️ Tu Retrato Actual en los Archivos del Reino
          </label>
          <div className="uploadAvatar text-center p-3 border rounded">
            {auth.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + auth.avatar}
                alt="Retrato Real"
                className="img-fluid rounded-circle mb-2"
                style={{
                  maxWidth: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            )}
            {auth.image == "default.png" && (
              <img
                src={Global.url + "user/avatar/default.png"}
                alt="Retrato Real por Defecto"
                className="img-fluid rounded-circle mb-2"
                style={{
                  maxWidth: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            )}
            <div className="form-text">
              Este es tu retrato oficial registrado en los anales del Reino
            </div>
          </div>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control mt-2"
          />
        </div>

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-lg">
                        ⚔️ Actualizar Registro Real
                      </button>
                      <button type="reset" className="btn btn-secondary">
                        🔄 Restaurar Pergamino Original
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
