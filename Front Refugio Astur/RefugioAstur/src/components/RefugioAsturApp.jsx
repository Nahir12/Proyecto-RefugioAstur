import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderApp from "./Layout/HeaderApp";
import "bootstrap/dist/css/bootstrap.min.css";
import { findAllCasas } from "../Services/CasasService";
import { findAllCaracteristicas } from "../Services/CaracteristicasService";

const RefugioAsturApp = () => {
  const hoy = new Date().toISOString().split("T")[0];

  const [ciudad, setCiudad] = useState("");
  const [precio, setPrecio] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [fechaFin, setFechaFin] = useState(hoy);
   const [numBaños, setNumBaños] = useState(1);
  const [numHabitaciones, setNumHabitaciones] = useState(1);

  const [caracteristicas, setCaracteristicas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [noResultados, setNoResultados] = useState(false);

  const navigate = useNavigate();

  // Obtener todas las características 
  useEffect(() => {
    findAllCaracteristicas()
      .then((response) => {
        setCaracteristicas(response.data ? response.data : response);
      })
      .catch((error) => {
        console.error("Error al obtener las características:", error);
      });
  }, []);

  // Obtener todas las ciudades
  useEffect(() => {
    findAllCasas()
      .then((casas) => {
        const ciudadesUnicas = [
          ...new Set(
            casas
              .map((c) => c.ciudad && c.ciudad.trim())
              .filter((c) => c && c.length > 0)
          ),
        ];
        setCiudades(ciudadesUnicas);
      })
      .catch((error) => {
        console.error("Error al obtener las ciudades:", error);
      });
  }, []);

  const handleFeatureChange = (featureName) => {
    if (seleccionados.includes(featureName)) {
      setSeleccionados(seleccionados.filter((f) => f !== featureName));
    } else {
      setSeleccionados([...seleccionados, featureName]);
    }
  };


  const cadenaCaract = () => seleccionados.join(", ");

  const handleFechaInicioChange = (e) => {
    const nuevaFechaInicio = e.target.value;
    setFechaInicio(nuevaFechaInicio);
    if (fechaFin < nuevaFechaInicio) {
      setFechaFin(nuevaFechaInicio);
    }
  };

  const handleBuscar = () => {
    const queryParams = new URLSearchParams({
      ciudad,
      precio,
      caracteristica: cadenaCaract(),
      fechaInicio,
      fechaFin,
      numBaños,
      numHabitaciones,
    }).toString();

    localStorage.setItem("fechaInicio", fechaInicio);
    localStorage.setItem("fechaFin", fechaFin);
    localStorage.setItem("ciudad", ciudad);
    localStorage.setItem("precio", precio);
    localStorage.setItem("caracteristicas", cadenaCaract());
    localStorage.setItem("numBaños", numBaños);
    localStorage.setItem("numHabitaciones", numHabitaciones);

    //filtro
    axios
      .get(`http://localhost:8080/casa/buscarCasasFiltro?${queryParams}`)
      .then((response) => {
        const resultadoCasas = response.data;
        if (resultadoCasas && resultadoCasas.length > 0) {
          navigate(`/casas-listado?${queryParams}`);
        } else {
          setNoResultados(true);
        }
      })
      .catch((error) => {
        console.error("Error al buscar casas:", error);
      });
  };

  // filtrado
  const arraydivisor = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const caracteristicasFilas = arraydivisor(caracteristicas, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <HeaderApp titulo="Refugio Astur" />

      <div className="container-fluid px-0">
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ color: "#2e7d32" }}>
            Reserva tu refugio en Asturias
          </h1>
          <p className="lead" style={{ color: "#3e5c3a" }}>
            Encuentra tu refugio perfecto para una estancia inolvidable en Asturias.
          </p>
        </div>

        <div
          style={{ borderRadius: "14px",background: "#fff", boxShadow: "0 2px 12px 0 rgba(44, 62, 80, 0.07)",
            marginBottom: "2rem",padding: "2rem", maxWidth: "900px", marginLeft: "auto",marginRight: "auto"}}>
          <h2 className="mb-3" style={{ color: "#3e5c3a" }}>Filtra tu búsqueda</h2>
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="ciudad" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  className="form-select"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="precio" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Precio máximo por noche (€)
                </label>
                <input
                  type="number"
                  id="precio"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 20"
                  min="10"
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Características
                </label>
                <div>
                  {caracteristicasFilas.map((fila, filaIdx) => (
                    <div className="row mb-2" key={filaIdx}>
                      {fila.map((caract, index) => (
                        <div className="col-md-4" key={caract.id ? caract.id : index}>
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
                              checked={seleccionados.includes(caract.nombre)}
                              onChange={() => handleFeatureChange(caract.nombre)}
                              style={{accentColor: "#2e7d32",width: "1.2em",height: "1.2em",marginRight: "0.7em"}}/>
                            <span style={{ color: "#2e7d32", fontWeight: 500, marginBottom: 0 }}>
                              {caract.nombre}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="fechaInicio" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  className="form-control"
                  value={fechaInicio}
                  onChange={handleFechaInicioChange}
                  min={hoy}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="fechaFin" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio}
                  required
                />
              </div>
                          <div className="col-md-6">
                <label htmlFor="numBanhos" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Número de Baños
                </label>
                <input
                  type="number"
                  id="numBanhos"
                  className="form-control"
                  value={numBaños}
                  onChange={(e) => setNumBaños(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="numHabitaciones" className="form-label fw-semibold" style={{ color: "#4e944f" }}>
                  Número de Habitaciones
                </label>
                <input
                  type="number"
                  id="numHabitaciones"
                  className="form-control"
                  value={numHabitaciones}
                  onChange={(e) => setNumHabitaciones(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button type="button" className="btn btn-success btn-lg px-5 shadow" style={{ background: "#4e944f", border: "none" }} onClick={handleBuscar}>
                Buscar refugio
              </button>
            </div>
          </form>
          {noResultados && (
            <p className="mt-3 text-danger text-center">
              No hay casas para esas especificaciones
            </p>
          )}
        </div>

        <hr className="my-4" />

        {/* Listado de características con descripción*/}
        <div className="mb-4">
          <h4 className="fw-bold text-center" style={{ color: "#3e5c3a" }}>¿Qué son las características?</h4>
          <p className="text-center" style={{ color: "#4e944f" }}>
            Las características son un método de filtrado pensado para encontrar la casa
            más apropiada para tus necesidades. Abajo puedes ver qué significa cada una de ellas.
          </p>
          <div className="row justify-content-center px-3">
            {caracteristicas.length > 0 ? (
              caracteristicas.map((caract, idx) => (
                <div key={caract.id ? caract.id : idx} className="col-md-6 mb-3">
                  <div
                    className="card h-100 shadow-sm border-0"
                    style={{borderLeft: "6px solid #7bb661", background: "#f6fff8",borderRadius: "12px",marginLeft: "10px",marginRight: "10px"}}>
                    <div className="card-body">
                      <strong style={{ color: "#4e944f" }}>{caract.nombre}</strong>
                      <div className="text-muted mt-1" style={{ fontSize: "1em" }}>
                        {caract.descripcion || "Sin descripción"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-muted">No hay características registradas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefugioAsturApp;