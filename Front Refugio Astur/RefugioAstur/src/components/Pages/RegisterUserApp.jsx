import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/AuthService";
import "../../Styles/AdminEstilos.css";

const RegisterUserApp = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!nombre.trim() || !email.trim() || !contraseña.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      await authService.registrar(nombre, email, contraseña);
      navigate("/login"); // Redirigir a login 
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al registrar usuario."
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 login-card">
        <h2 className="text-center mb-4">Registrarse</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingresa tu correo electrónico"
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
              placeholder="Ingresa tu contraseña (mín. 6 caracteres)"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserApp;
