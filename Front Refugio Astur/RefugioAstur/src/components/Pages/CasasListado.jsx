import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { getCaracteristicasCasa } from "../../Services/CasaCaracteristicaService";
import { findImagenesCasa } from "../../Services/CasasService";
import HeaderApp from "../Layout/HeaderApp";

const CasasListado = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [casas, setCasas] = useState([]);
  const [caracteristicasCasas, setCaracteristicasCasas] = useState({});
  const [imagenesCasas, setImagenesCasas] = useState({});

  const dominio = "http://localhost:5173";
  const imagenPorDefecto = `${dominio}/imagenes/sinImagenes.png`;

  const getImagenUrl = (url) => {
    if (!url || url.trim() === "") {
      return imagenPorDefecto;
    } else {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      } else {
        return `${dominio}${url}`;
      }
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/casa/buscarCasasFiltro?${queryParams.toString()}`)
      .then((response) => {
        setCasas(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar casas:", error);
      });
  }, [location.search]);

  useEffect(() => {
    if (casas && casas.length > 0) {
      casas.forEach((casa) => {
        getCaracteristicasCasa(casa.idCasa)
          .then((res) => {
            setCaracteristicasCasas((prev) => ({
              ...prev,
              [casa.idCasa]: Array.isArray(res) ? res : [],
            }));
          })
          .catch(() => {
            setCaracteristicasCasas((prev) => ({
              ...prev,
              [casa.idCasa]: [],
            }));
          });
      });
    }
  }, [casas]);

  useEffect(() => {
    if (casas && casas.length > 0) {
      casas.forEach((casa) => {
        findImagenesCasa(casa.idCasa)
          .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
              setImagenesCasas((prev) => ({
                ...prev,
                [casa.idCasa]: res,
              }));
            } else {
              setImagenesCasas((prev) => ({
                ...prev,
                [casa.idCasa]: [{ url_imagen: imagenPorDefecto }],
              }));
            }
          })
          .catch(() => {
            setImagenesCasas((prev) => ({
              ...prev,
              [casa.idCasa]: [{ url_imagen: imagenPorDefecto }],
            }));
          });
      });
    }
  }, [casas]);

  // Mostrar solo una imagen por casa
  const imgs = (casa) => {
    const imagenes = imagenesCasas[casa.idCasa];
    const imagen = imagenes && imagenes.length > 0 ? imagenes[0] : { url_imagen: imagenPorDefecto };
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={getImagenUrl(imagen.url_imagen)}
          alt={casa.nombre}
          style={{
            width: "100%",
            maxWidth: "370px",
            height: "220px",
            objectFit: "cover",
            borderRadius: "16px",
            border: "4px solid #b7e4c7",
            boxShadow: "0 2px 12px 0 rgba(44, 62, 80, 0.12)",
            background: "#fff"
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        padding: "0",
        margin: "0",
      }}
    >
      <HeaderApp titulo="Listado de Casas" />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1
          className="fw-bold text-center"
          style={{
            color: "#2e7d32",
            marginBottom: "2rem",
            fontSize: "2.5rem",
            letterSpacing: "1px"
          }}
        >
          Listado de Casas
        </h1>
        {casas.length > 0 ? (
          <div className="row justify-content-center">
            {casas.map((casa) => (
              <div key={casa.idCasa} className="col-12 col-md-6 mb-5 d-flex align-items-stretch">
                <div
                  className="card shadow-sm w-100"
                  style={{
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "none",
                    boxShadow: "0 2px 12px 0 rgba(44, 62, 80, 0.07)",
                    padding: "1.5rem"
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title text-success text-center" style={{ fontWeight: 700 }}>
                      {casa.nombre}
                    </h3>
                    <div className="mb-3">{imgs(casa)}</div>
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item" style={{ background: "transparent" }}>
                        <strong>Ciudad:</strong> {casa.ciudad}
                      </li>
                      <li className="list-group-item" style={{ background: "transparent" }}>
                        <strong>Dirección:</strong> {casa.direccion}
                      </li>
                      <li className="list-group-item" style={{ background: "transparent" }}>
                        <strong>Precio:</strong> {casa.precio} €
                      </li>
                      <li className="list-group-item" style={{ background: "transparent" }}>
                        <strong>Habitaciones:</strong> {casa.numHabitaciones}
                      </li>
                      <li className="list-group-item" style={{ background: "transparent" }}>
                        <strong>Baños:</strong> {casa.numBaños}
                      </li>
                    </ul>
                    <div className="mb-3">
                      {caracteristicasCasas[casa.idCasa] && caracteristicasCasas[casa.idCasa].length > 0 ? (
                        <div className="d-flex flex-wrap justify-content-center">
                          {caracteristicasCasas[casa.idCasa].map((carac, idx) => (
                            <span key={idx} className="badge bg-success me-2 mb-2 px-3 py-2 fs-6">
                              {carac.nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Sin características registradas.</span>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Link to={`/casa/${casa.idCasa}`} className="btn btn-outline-primary w-100">
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No se encontraron casas.</p>
        )}
      </div>
    </div>
  );
};

export default CasasListado;