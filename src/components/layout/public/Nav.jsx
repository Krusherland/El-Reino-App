import React from "react";
import { NavLink } from "react-router-dom";

export const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <i className="fa-brands fa-fort-awesome-alt"></i>
          El Reino
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/login">
              <i className="fa-solid fa-torii-gate"></i>
              Entrar
            </NavLink>
            <NavLink className="nav-link" to="/register">
              <i className="fa-solid fa-feather"></i>
              Nombramiento
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
