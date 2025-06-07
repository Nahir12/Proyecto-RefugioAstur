import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findImagenesCasa, findAllCasas } from "../../Services/CasasService"; 
import { getCaracteristicasCasa } from "../../Services/CasaCaracteristicaService";
import { sacarTotal, crearAlquiler } from "../../Services/AlquilerService";
import HeaderApp from "../Layout/HeaderApp";
import authService from "../../Services/AuthService.js";
import "../../Styles/AdminEstilos.css";

const CasaDetalle = () => {
  const { idCasa } = useParams();
  const navigate = useNavigate();

  // Recuperamos fechas y otros filtros desde localStorage
  const storedFechaInicio = localStorage.getItem("fechaInicio");
  const storedFechaFin = localStorage.getItem("fechaFin");

  // casa, imágenes, características y precio total
  const [casa, setCasa] = useState({ email: "" });
  const [imagenes, setImagenes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [total, setTotal] = useState(null);

  const domain = "http://localhost:5173";//done estan la imagenes
  const defaultImage = `${domain}/imagenes/sinImagenes.png`;

  // Cargar datos de la casa
  useEffect(() => {
    const cargarDatosCasa = async () => {
      if (!idCasa) return;
      try {
        const respuestaCasas = await findAllCasas();
        if (Array.isArray(respuestaCasas)) {
          const casaEncontrada = respuestaCasas.find(
            (c) => String(c.idCasa) === String(idCasa)
          );
          setCasa(casaEncontrada || { email: "" });
        } else {
          setCasa({ email: "" });
        }
      } catch (error) {
        console.error("Error al obtener la casa:", error);
        setCasa({ email: "" });
      }

      try {
        const imgs = await findImagenesCasa(idCasa);
        if (Array.isArray(imgs)) {
          setImagenes(imgs);
          if (imgs.length > 0 && imgs[0].url_imagen) {
            setImagenSeleccionada(imgs[0].url_imagen);
          }
        }
      } catch (error) {
        console.error("Error al obtener imágenes:", error);
      }

      try {
        const datosCaracteristicas = await getCaracteristicasCasa(idCasa);
        setCaracteristicas(datosCaracteristicas || []);
      } catch (error) {
        console.error("Error al obtener características:", error);
      }
    };

    cargarDatosCasa();
  }, [idCasa]);

  // Calcular el precio total 
  useEffect(() => {
    const calcularPrecioTotal = async () => {
      if (idCasa && storedFechaInicio && storedFechaFin) {
        try {
          const totalCalculado = await sacarTotal(
            idCasa,
            storedFechaInicio,
            storedFechaFin
          );
          setTotal(totalCalculado);
        } catch (error) {
          console.error("Error al obtener el precio total:", error);
        }
      }
    };

    calcularPrecioTotal();
  }, [idCasa, storedFechaInicio, storedFechaFin]);

  // gestionar reserva
  const handleReservar = async () => {
    // Intentamos obtener el usuario mediante authService
    let usuarioID = null;
    if (authService.estaAutenticado()) {
      usuarioID = authService.obtenerUsuarioIDDelToken();
    }
    // Si usuarioID es null, redirigimos al formulario de usuario temporal
    if (!usuarioID) {
      navigate("/usuario-temporal", {
        state: {
          casa,
          total,
          fechaInicio: storedFechaInicio,
          fechaFin: storedFechaFin,
          idCasa,
        },
      });
      return;
    }

    // Si se obtuvo un usuario, proceder con la reserva
    const dataAlquiler = {
      usuarioID: usuarioID,
      casaID: idCasa,
      fechaInicio: storedFechaInicio,
      fechaFin: storedFechaFin,
      precio: total,
    };

    const mensaje =
      `Estás a punto de alquilar la casa "${casa.nombre || "el inmueble"}"\n` +
      `del ${storedFechaInicio} al ${storedFechaFin}\n` +
      `por un total de ${Number(total).toFixed(2)}€.\n¿Desea continuar?`;

    if (window.confirm(mensaje)) {
      try {
        const alquilerCreado = await crearAlquiler(dataAlquiler);
        console.log("Alquiler creado:", alquilerCreado);
        alert("Alquiler creado con éxito.");
      } catch (error) {
        console.error("Error al crear el alquiler:", error);
        alert("Error al crear el alquiler. Por favor, inténtalo de nuevo.");
      }
    }
  };

  if (!casa) {
    return (
      <>
        <HeaderApp titulo="Detalle de Casa" />
        <div className="container text-center pt-5">
          <p>Cargando detalles de la casa...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderApp titulo={casa.nombre || "Detalle de Casa"} />
      <div
        className="container my-4"
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="row">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="image-gallery">
              <img
                id="mainImage"
                src={imagenSeleccionada || defaultImage}
                alt={`Imagen principal de ${casa.nombre}`}
                className="img-fluid w-100"
                style={{
                  borderRadius: "8px",
                  maxHeight: "550px",
                  objectFit: "cover",
                }}
              />
              {imagenes.length > 1 && (
                <div className="thumbnails mt-3 d-flex flex-wrap gap-2 justify-content-start">
                  {imagenes.map((img, index) =>
                    img.url_imagen ? (
                      <img
                        key={index}
                        src={img.url_imagen}
                        alt={img.descripcion || `Miniatura ${index + 1}`}
                        className="img-thumbnail"
                        style={{
                          cursor: "pointer",
                          width: "100px",
                          height: "75px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border:
                            imagenSeleccionada === img.url_imagen
                              ? "3px solid #2E7D32"
                              : "1px solid #ddd",
                        }}
                        onClick={() => setImagenSeleccionada(img.url_imagen)}
                      />
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="description p-3">
              <h2 className="mb-3" style={{ color: "#1B5E20" }}>
                {casa.nombre}
              </h2>
              <p className="lead text-muted" style={{ textAlign: "justify" }}>
                {casa.descripcion}
              </p>

              <div className="mt-4">
                <p className="h5 mb-2">
                  <strong>Ciudad: </strong>
                  {casa.ciudad || "No especificada"}
                </p>
                <p className="h5 mb-2">
                  <strong>Dirección: </strong>
                  {casa.direccion || "No especificada"}
                </p>
                <p className="h5 mb-2">
                  <strong>Habitaciones: </strong>
                  {casa.numHabitaciones || "No especificado"}
                </p>
                <p className="h5 mb-2">
                  <strong>Baños: </strong>
                  {casa.numBaños || "No especificado"}
                </p>
                <p className="h5 mb-2">
                  <strong>Email de contacto: </strong>
                  {casa.email || "No especificado"}
                </p>
              </div>

              {caracteristicas && caracteristicas.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3" style={{ color: "#1B5E20" }}>
                    Comodidades Destacadas:
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    {caracteristicas.map(
                      (car, idx) =>
                        car.nombre && (
                          <span
                            key={idx}
                            className="badge bg-success-subtle text-success-emphasis p-2 rounded-pill"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {car.nombre}
                          </span>
                        )
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className="h4">Precio Total: {total}€</p>
                <button className="btn btn-primary mt-3" onClick={handleReservar}>
                  Reservar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasaDetalle;
