import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/AuthService.js";
import "../../Styles/AdminEstilos.css";

const LoginUsuariosApp = () => {
  const { login, obtenerRutaRedireccion, limpiarRutaRedireccion } = authService;
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !contraseña.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // Se llama al método login
      await login(email, contraseña);
      
      const usuarioLogueado = authService.obtenerUsuarioActual();
      if (usuarioLogueado) {
        if (!usuarioLogueado.idUsuario && usuarioLogueado.id) {
          usuarioLogueado.idUsuario = usuarioLogueado.id;
          localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
        }
      }

      const rutaRedireccion = obtenerRutaRedireccion();
      navigate(rutaRedireccion);
      limpiarRutaRedireccion();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 login-card">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="contraseña"
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>
        <div className="text-center mt-3">
          <span>¿Aún no tienes una cuenta? </span>
          <button
            className="btn btn-link p-0"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuariosApp;
