import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../Services/AuthService";

const HeaderApp = ({ titulo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const autenticado = authService.estaAutenticado();
  const admin = authService.esAdmin();
  const usuario = authService.obtenerUsuarioActual();

  // controlar el menú colapsable
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarLogin = () => {
    authService.guardarRutaRedireccion(location.pathname + location.search);
    navigate("/login");
  };

  const manejarLogout = () => {
    authService.logout();
    navigate("/");
    window.location.reload();
  };

  // Cierra el menú 
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2E7D32', marginBottom: '2rem' }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontSize: '1.75rem', fontWeight: 'bold' }} onClick={cerrarMenu}>
          {titulo || "Refugio Astur"}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNavDropdown"
          aria-expanded={menuAbierto}
          aria-label="Toggle navigation"
          onClick={() => setMenuAbierto((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${menuAbierto ? " show" : ""}`} id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto align-items-center">
            {!autenticado && (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => { manejarLogin(); cerrarMenu(); }}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light"
                    onClick={() => { navigate("/registro"); cerrarMenu(); }}
                  >
                    Registrarse
                  </button>
                </li>
              </>
            )}
            {autenticado && (
              <>
                <li className="nav-item me-3">
                  <span className="navbar-text text-white">
                    Hola, {usuario?.username || "Usuario"}
                  </span>
                </li>
                {admin && (
                  <li className="nav-item">
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => { navigate("/admin/panel"); cerrarMenu(); }}
                    >
                      Administrar
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="btn btn-info me-2" to="/perfil" onClick={cerrarMenu}>Mi Perfil</Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => { manejarLogout(); cerrarMenu(); }}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default HeaderApp;