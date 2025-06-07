import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../Services/AuthService";
import { crearAlquiler } from "../../Services/AlquilerService"; 

const UsuarioTemporal = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
 
  const [registrarse, setRegistrarse] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // s datos deCasaDetalle
  const { idCasa, fechaInicio, fechaFin, total, casa } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosRegistro = {
      nombre,
      email,
      contraseña: registrarse ? contraseña : null,
      esTemporal: !registrarse,
      admin: false,
      urlFotoPerfil: null,
    };

    try {
      // Crear el usuario (temporal o registrado según la opción)
      const respuesta = await authService.registrar(
        datosRegistro.nombre,
        datosRegistro.email,
        datosRegistro.contraseña,
        datosRegistro.urlFotoPerfil,
        datosRegistro.esTemporal
      );
      console.log("Usuario creado:", respuesta);

      // Mensaje de confirmacion
      const mensaje = `Estás a punto de alquilar la casa "${
        casa?.nombre || "el inmueble"
      }" del ${fechaInicio} al ${fechaFin} por un total de ${Number(total).toFixed(
        2
      )}€. ¿Desea continuar?`;

      if (window.confirm(mensaje)) {

        const datosAlquiler = {
          usuarioID: respuesta.idUsuario, 
          casaID: idCasa,                 
          fechaInicio,
          fechaFin,
          precio: total, 
        };

        try {
          const alquilerResponse = await crearAlquiler(datosAlquiler);
          console.log("Alquiler creado:", alquilerResponse);
          // Se redirige a la ruta de detalle de la casa
          navigate(`/detalle-casa/${idCasa}`);
        } catch (alquilerError) {
          console.error("Error al crear el alquiler:", alquilerError);
          setError("Error al crear el alquiler.");
          alert("Error al crear el alquiler.");
        }
      }
    } catch (userError) {
      console.error("Error al crear el usuario:", userError);
      setError("Ocurrió un error durante la creación del usuario.");
      alert("Ocurrió un error durante la creación del usuario.");
    }
  };

  return (
    <div className="usuario-temporal-form" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Introduzca sus datos para la reserva</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="nombre" style={{ display: "block" }}>Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block" }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required  
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={registrarse}
              onChange={(e) => setRegistrarse(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            Quiero registrarme
          </label>
        </div>
        {registrarse && (
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="contraseña" style={{ display: "block" }}>Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        )}
        <button type="submit" style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
          Enviar
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span>¿Ya estás registrado? </span>
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/login")}
        >
          Inicia sesión
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UsuarioTemporal;
