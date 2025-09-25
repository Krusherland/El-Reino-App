import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Global } from "../../../helpers/Global";

export const Dungeons = () => {
  useEffect(() => {
    getUsers();
  }, []);
  const { auth, loading } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const getUsers = async () => {
    const request = await fetch(Global.url + "user/list", {
      method: "GET",
      headers: { Authorization: token },
    });
    const data = await request.json();
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
      <div className="row">
        <div className="col-12">
          <div className="card mb-4 border-warning">
            <div className="card-header bg-warning text-dark">
              <h1 className="mb-0"> Las Grandes Mazmorras del Reino</h1>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading"> ¡Salve, Noble {auth.name}!</h4>
                <p className="mb-0">
                  Has llegado a las legendarias Mazmorras del Reino, donde los más valientes aventureros 
                  han forjado sus destinos. Aquí podrás explorar los calabozos de otros nobles, 
                  descubrir tesoros ocultos y forjar alianzas que perdurarán por las eras.
                </p>
                <hr />
                <p className="mb-0">
                  <strong> Consejo del Sabio:</strong> Cada mazmorra guarda secretos únicos. 
                  Explora con cautela y respeto hacia tus compañeros de aventura.
                </p>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="fa-solid fa-chess-rook fa-3x text-primary mb-3"></i>
                      <h5 className="card-title">Mazmorras Activas</h5>
                      <p className="card-text">Calabozos de nobles activos</p>
                      <span className="badge bg-primary">Próximamente</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="fa-solid fa-users fa-3x text-success mb-3"></i>
                      <h5 className="card-title">Alianzas</h5>
                      <p className="card-text">Encuentra compañeros de aventura</p>
                      <span className="badge bg-success">Próximamente</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <i className="fa-solid fa-trophy fa-3x text-danger mb-3"></i>
                      <h5 className="card-title">Clasificaciones</h5>
                      <p className="card-text">Los más ilustres del Reino</p>
                      <span className="badge bg-danger">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
