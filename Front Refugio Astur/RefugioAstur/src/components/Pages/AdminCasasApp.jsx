import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  findAllCasas,
  crearCasa,
  findImagenesCasa,
  removeCasa,
  crearImagenCasa,
} from "../../Services/CasasService";
import {
  getCaracteristicasCasa,
  createCasaCaracteristica,
} from "../../Services/CasaCaracteristicaService";
import { findAllCaracteristicas } from "../../Services/CaracteristicasService";
import HeaderApp from "../Layout/HeaderApp";

export const AdminCasasApp = () => {
  // Estados para la casa y sus propiedades
  const [casas, setCasas] = useState([]);
  const [imagenesCasas, setImagenesCasas] = useState({});
  const [caracteristicasCasas, setCaracteristicasCasas] = useState({});
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    descripcion: "",
    precio: 10,
    numHabitaciones: 1,
    numBaños: 1,
    email: "",
  });

  // checklist de características
  const [caracteristicasDisponibles, setCaracteristicasDisponibles] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);

  // crear imágenes 
  const [bloquesImagenes, setBloquesImagenes] = useState([]);

  const navigate = useNavigate();
  const dominio = "http://localhost:5173";
  const imagenPorDefecto = `${dominio}/imagenes/sinImagenes.png`;

  // Cargar las características
  useEffect(() => {
    const cargarCaracteristicasDisponibles = async () => {
      try {

        const response = await findAllCaracteristicas();
        const caracs = response.data ? response.data : response;
        setCaracteristicasDisponibles(Array.isArray(caracs) ? caracs : []);
      } catch (error) {
        console.error("Error al obtener características disponibles:", error);
        setCaracteristicasDisponibles([]);
      }
    };
    cargarCaracteristicasDisponibles();
  }, []);

  // cargar las casas, sus imágenes y sus características asociadas
  const cargarCasas = async () => {
    try {
      const respuesta = await findAllCasas();
      const casasProcesadas = Array.isArray(respuesta)
        ? respuesta
        : respuesta?.data && Array.isArray(respuesta.data)
          ? respuesta.data
          : [];
      setCasas([...casasProcesadas]);
      casasProcesadas.forEach(async (casa) => {
        // Cargar imágenes para cada casa
        try {
          const imagenes = await findImagenesCasa(casa.idCasa);
          setImagenesCasas((prev) => ({
            ...prev,
            [casa.idCasa]:
              imagenes && imagenes.length > 0
                ? imagenes
                : [{ url_imagen: imagenPorDefecto }],
          }));
        } catch (error) {
          setImagenesCasas((prev) => ({
            ...prev,
            [casa.idCasa]: [{ url_imagen: imagenPorDefecto }],
          }));
        }
        // Cargar características
        try {
          const caracs = await getCaracteristicasCasa(casa.idCasa);
          setCaracteristicasCasas((prev) => ({
            ...prev,
            [casa.idCasa]: caracs && caracs.length > 0 ? caracs : [],
          }));
        } catch (error) {
          setCaracteristicasCasas((prev) => ({
            ...prev,
            [casa.idCasa]: [],
          }));
        }
      });
    } catch (error) {
      console.error("Error al cargar las casas:", error);
    }
  };

  useEffect(() => {
    cargarCasas();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [name]:
        name === "numHabitaciones" || name === "numBaños" ? Number(value) : value,
    }));
  };

  //checklist de características
  const manejarCambioCaracteristica = (e) => {
    const idCaracteristica = Number(e.target.value);
    if (e.target.checked) {
      setCaracteristicasSeleccionadas((prev) => [...prev, idCaracteristica]);
    } else {
      setCaracteristicasSeleccionadas((prev) =>
        prev.filter((id) => id !== idCaracteristica)
      );
    }
  };

  //crear imagenes
  const agregarBloqueImagen = () => {
    setBloquesImagenes((prev) => [...prev, { url: "", descripcion: "" }]);
  };

  const cambioUrlImagen = (indice, e) => {
    const { value } = e.target;
    setBloquesImagenes((prev) =>
      prev.map((bloque, idx) =>
        idx === indice ? { ...bloque, url: value } : bloque
      )
    );
  };

  const cambioDescripcionImagen = (indice, e) => {
    const { value } = e.target;
    setBloquesImagenes((prev) =>
      prev.map((bloque, idx) =>
        idx === indice ? { ...bloque, descripcion: value } : bloque
      )
    );
  };

  const cancelarBloqueImagen = (indice) => {
    setBloquesImagenes((prev) => prev.filter((_, idx) => idx !== indice));
  };

  // envío del formulario para crear la casa, sus características y sus imágenes
  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    try {
      // Crear la casa
      const respuestaCasa = await crearCasa(datosFormulario);
      const nuevaCasa = respuestaCasa;
      let idCasaNueva;
      if (Array.isArray(nuevaCasa)) {
        if (nuevaCasa.length > 0 && nuevaCasa[0].idCasa) {
          idCasaNueva = nuevaCasa[0].idCasa;
        }
      } else if (nuevaCasa && nuevaCasa.idCasa) {
        idCasaNueva = nuevaCasa.idCasa;
      }
      if (!idCasaNueva) {
        throw new Error("La respuesta del backend no contiene 'idCasa'.");
      }
      // Crear Casa c  aracterísticas
      for (const idCaracteristica of caracteristicasSeleccionadas) {
        await createCasaCaracteristica({
          idCasa: idCasaNueva,
          idCaracteristica,
        });
      }
      // Enviar las imágenes)
 for (const bloque of bloquesImagenes) {
        const urlImagenFinal =
          bloque.url && bloque.url.trim() !== "" ? bloque.url.trim() : "/imagen/imagen-default.png";
        if (!bloque.descripcion || bloque.descripcion.trim() === "") {
          throw new Error("Todos los bloques de imagen requieren URL y descripción.");
        }
        const payloadImagen = {
          idCasa: idCasaNueva,
          urlImagen: urlImagenFinal, 
          descripcion: bloque.descripcion,
        };
        console.log("Enviando imagen al backend:", payloadImagen);
        await crearImagenCasa(payloadImagen);
      }
      await cargarCasas();
      // Resetear el formulario
      setDatosFormulario({
        nombre: "",
        direccion: "",
        ciudad: "",
        descripcion: "",
        precio: 10,
        numHabitaciones: 1,
        numBaños: 1,
        email: "",
      });
      setCaracteristicasSeleccionadas([]);
      setBloquesImagenes([]);
    } catch (error) {
      console.error("Error al crear la casa:", error);
    }
  };

  //  borrar una casa
  const manejarBorrar = async (idCasa) => {
    try {
      await removeCasa(idCasa);
      await cargarCasas();
    } catch (error) {
      console.error("Error al borrar la casa:", error);
    }
  };

  // ir a la página de edición 
  const manejarActualizar = (idCasa) => {
    navigate(`../Casas/CasasEdit/${idCasa}`);
  };

  // caract
  const caractArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const caracteristicasFilas = caractArray(caracteristicasDisponibles, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <HeaderApp titulo="Administración de Casas" />
      <div className="container mt-4">
        {/* Formulario para crear Casa */}
        <div className="card mb-4 p-3" style={{ border: "none", borderRadius: "14px", boxShadow: "0 2px 12px 0 rgba(44, 62, 80, 0.07)" }}>
          <h2
            className="fw-bold text-center"
            style={{
              color: "#2e7d32",
              marginBottom: "2rem",
              fontSize: "2rem",
              letterSpacing: "1px"
            }}
          >
            Crear Casa
          </h2>
          <form onSubmit={manejarEnvioFormulario}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={datosFormulario.nombre}
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  className="form-control"
                  value={datosFormulario.ciudad}
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-control"
                  value={datosFormulario.direccion}
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={datosFormulario.email}
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  name="precio"
                  className="form-control"
                  value={datosFormulario.precio}
                  onChange={manejarCambioInput}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Habitaciones</label>
                <input
                  type="number"
                  name="numHabitaciones"
                  className="form-control"
                  value={datosFormulario.numHabitaciones}
                  onChange={manejarCambioInput}
                  min="1"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Baños</label>
                <input
                  type="number"
                  name="numBaños"
                  className="form-control"
                  value={datosFormulario.numBaños}
                  onChange={manejarCambioInput}
                  min="1"
                  required
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  value={datosFormulario.descripcion}
                  onChange={manejarCambioInput}
                  rows={2}
                  required
                />
              </div>
            </div>
            {/* imaegnes */}
            <div className="mb-3">
              <h3 className="fw-semibold" style={{ color: "#3e5c3a" }}>Crear Imágenes</h3>
              {bloquesImagenes.map((bloque, indice) => (
                <div
                  key={indice}
                  style={{ border: "1px solid #b7e4c7", borderRadius: "8px", padding: "10px", marginBottom: "10px", background: "#f8fafc" }}
                >
                  <div>
                    <label>URL de la imagen:</label>
                    <input
                      type="text"
                      value={bloque.url}
                      onChange={(e) => cambioUrlImagen(indice, e)}
                      placeholder="/imagen/casa1.jpg"
                      required
                      style={{ width: "100%", borderRadius: "6px", border: "1px solid #b7e4c7", padding: "4px 8px" }}
                    />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    <label>Descripción de la imagen:</label>
                    <input
                      type="text"
                      value={bloque.descripcion}
                      onChange={(e) => cambioDescripcionImagen(indice, e)}
                      required
                      style={{ width: "100%", borderRadius: "6px", border: "1px solid #b7e4c7", padding: "4px 8px" }}
                    />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    <button
                      type="button"
                      onClick={() => cancelarBloqueImagen(indice)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Cancelar imagen
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={agregarBloqueImagen}
                className="btn"
                style={{
                  background: "#4e944f",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "8px 18px",
                  marginTop: "8px",
                  boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)"
                }}
              >
                + Añadir imagen
              </button>
            </div>
            {/* Características */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                Características:
              </label>
              <div>
                {caracteristicasFilas.map((fila, filaIdx) => (
                  <div className="row mb-2" key={filaIdx}>
                    {fila.map((carac, index) => (
                      <div className="col-md-4" key={carac.idCaracteristica}>
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: "8px",
                            padding: "0.75rem 1rem",
                            marginBottom: "0.5rem",
                            border: "1px solid #b7e4c7",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`carac-${carac.idCaracteristica}`}
                            value={carac.idCaracteristica}
                            onChange={manejarCambioCaracteristica}
                            checked={caracteristicasSeleccionadas.includes(carac.idCaracteristica)}
                            style={{
                              accentColor: "#2e7d32",
                              width: "1.2em",
                              height: "1.2em",
                              marginRight: "0.7em"
                            }}
                          />
                          <label
                            htmlFor={`carac-${carac.idCaracteristica}`}
                            style={{ color: "#2e7d32", fontWeight: 500, marginBottom: 0 }}
                          >
                            {carac.nombre}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Crear Casa
            </button>
          </form>
        </div>
        {/* Listado de Casas */}
        <div className="card mb-4 p-3">
           <h3 className="fw-semibold" style={{ color: "#3e5c3a" }}>Listado de casas</h3>
          <div className="list-group">
            {casas.length > 0 ? (
              casas.map((casa) => (
                <div key={casa.idCasa} className="card mb-3 p-3">
                  <h3 className="card-title text-success text-center" style={{ fontWeight: 700 }}>
                    {casa.nombre}
                  </h3>
                  <div className="mb-2">
                    {/*  imágenes */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {(imagenesCasas[casa.idCasa] || [{ url_imagen: imagenPorDefecto }]).map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url_imagen}
                          alt={`Imagen ${idx + 1} de ${casa.nombre}`}
                          style={{
                            width: "100%",
                            maxWidth: "350px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
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
                    <li className="list-group-item" style={{ background: "transparent" }}>
                      <strong>Email:</strong> {casa.email}
                    </li>
                  </ul>
                  <div className="mb-3">
                    <h6 className="fw-bold text-success text-center mb-2" style={{ fontSize: "1.1rem" }}>
                      Características Registradas
                    </h6>
                    {caracteristicasCasas[casa.idCasa] && caracteristicasCasas[casa.idCasa].length > 0 ? (
                      <div className="d-flex flex-wrap justify-content-center">
                        {caracteristicasCasas[casa.idCasa].map((carac, idx) => (
                          <span
                            key={idx}
                            className="badge bg-success me-2 mb-2 px-3 py-2 fs-6"
                          >
                            {carac.nombre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">Sin características registradas.</span>
                    )}
                  </div>
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-danger"
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarBorrar(casa.idCasa);
                      }}
                    >
                      Borrar
                    </button>
                    <button
                      className="btn btn-warning"
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarActualizar(casa.idCasa);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>⚠️ No hay casas registradas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCasasApp;