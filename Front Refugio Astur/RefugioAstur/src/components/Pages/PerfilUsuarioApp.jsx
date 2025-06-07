import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import authService from "../../Services/AuthService.js";
import { obtenerAlquileresPorUsuario } from "../../Services/AlquilerService.js";
import HeaderApp from "../Layout/HeaderApp";

const PerfilUsuarioApp = () => {
  const navigate = useNavigate();


  const [usuarioLocal] = useState(() => {
    const u = authService.obtenerUsuarioActual();
    if (u && !u.idUsuario) {
      const tokenId = authService.obtenerUsuarioIDDelToken();
      if (tokenId) {
        u.idUsuario = tokenId;
        localStorage.setItem("usuarioLogueado", JSON.stringify(u));
      }
    }
    return u;
  });

  // Extraemos el id del usuario
  const idUsuarioLocal = usuarioLocal?.idUsuario || authService.obtenerUsuarioIDDelToken();

  //  alquileres recientes del usuario
  const [alquileresRecientes, setAlquileresRecientes] = useState([]);

  useEffect(() => {
    if (usuarioLocal && idUsuarioLocal) {
      obtenerAlquileresPorUsuario(idUsuarioLocal)
        .then((data) => {
          setAlquileresRecientes(data);
        })
        .catch((error) => {
          console.error("Error al obtener alquileres recientes:", error);
        });
    }
  }, [usuarioLocal, idUsuarioLocal]);

  if (!authService.estaAutenticado()) {
    return <Navigate to="/login" state={{ from: "/perfil" }} replace />;
  }

  const emailUsuario =
    usuarioLocal?.nombreCompleto ||
    usuarioLocal?.username ||
    usuarioLocal?.email ||
    "Usuario";

  return (
    <>
      <HeaderApp titulo="Mi Perfil" />
      <div className="container mt-4 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-4 text-center">
                <h2 className="mb-3" style={{ color: "#3e5c3a", fontWeight: 700 }}>
                  Hola, {emailUsuario}
                </h2>
                <h4 className="mb-0" style={{ color: "#4e944f", fontWeight: 500 }}>
                  Esto es lo que has hecho últimamente:
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*mostrar los alquileres recientes */}
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Mis Alquileres Recientes</h2>
          </div>
          <div className="card-body">
            {alquileresRecientes && alquileresRecientes.length > 0 ? (
              <ul className="list-group">
                {alquileresRecientes.map((alquiler, idx) => (
                  <li className="list-group-item" key={idx}>
                    <div>
                      <strong>Casa:</strong> {alquiler.casa?.nombre || "Casa desconocida"}
                    </div>
                    <div>
                      <strong>Fecha Inicio:</strong>{" "}
                      {new Date(alquiler.fechaInicio).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Fecha Fin:</strong>{" "}
                      {new Date(alquiler.fechaFin).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Precio:</strong> {alquiler.precio} €
                    </div>
                    {/* Botón que redirige a la vista de detalles */}
                    {alquiler.casa?.idCasa && (
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={() => navigate(`/detalle-casa/${alquiler.casa.idCasa}`)}
                      >
                        Ver detalle de la casa
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes alquileres recientes.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilUsuarioApp;