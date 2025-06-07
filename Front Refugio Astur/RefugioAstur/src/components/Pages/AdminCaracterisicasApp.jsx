import { useState, useEffect } from "react";
import {
  findAllCaracteristicas,
  updateCaracteristica,
  crearCaracteristica,
  removeCaracteristica,
} from "../../Services/CaracteristicasService";
import { CaracteristicaGrid } from "../Caracteristicas/CaracteristicasGrid";
import { CaracteristicasForm } from "../Caracteristicas/CaracteristicasForm";
import HeaderApp from "../Layout/HeaderApp";

export const AdminCaracteristicasApp = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicaSelected, setCaracteristicaSelected] = useState(null);

  // Obtener todas las características
  const getCaracteristicas = async () => {
    try {
      const result = await findAllCaracteristicas();
      if (Array.isArray(result)) {
        const data = result.map((item) => ({
          ...item,
          id: item.id != null ? item.id : item.idCaracteristica,
        }));
        setCaracteristicas(data);
      } else {
        console.error("hubo un problema",result);
        setCaracteristicas([]);
      }
    } catch (error) {
      console.error(
        "Error al obtener caracteristicas:",error);
      setCaracteristicas([]);
    }
  };

  useEffect(() => {
    getCaracteristicas();
  }, []);

  // Agregar o actualizar una característica
  const handlerAddCaracteristica = async (caracteristica) => {
    try {
      let response;
      if (caracteristica.id && caracteristica.id > 0) {
        response = await updateCaracteristica(caracteristica);
        if (response && (response.id || response.idCaracteristica)) {
          setCaracteristicas(
            caracteristicas.map((char) =>
              char.id === (response.id || response.idCaracteristica)
                ? { ...response, id: response.id || response.idCaracteristica }
                : char
            )
          );
        } else {
          console.error("Error:", response);
        }
      } else {
        response = await crearCaracteristica(caracteristica);
        if (response && (response.id || response.idCaracteristica)) {
          setCaracteristicas([
            ...caracteristicas,
            { ...response, id: response.id || response.idCaracteristica },
          ]);
        } else {
          console.error("Error:", response);
        }
      }
      setCaracteristicaSelected(null);
    } catch (error) {
      console.error("Errror:", error);
    }
  };

  // Eliminar una característica
  const handlerRemoveCaracteristica = async (id) => {
    try {
      await removeCaracteristica(id);
      setCaracteristicas(caracteristicas.filter((char) => char.id !== id));
    } catch (error) {
      console.error(" Error al borrar",error);
    }
  };

  // Seleccionar una característica para editarla
  const handlerCaracteristicaSelected = (caracteristica) => {
    setCaracteristicaSelected({ ...caracteristica });
  };

  // Cancelar edición
  const handlerCancel = () => {
    setCaracteristicaSelected(null);
  };

  return (
    <div>
      <HeaderApp titulo="Administrar Características" />
      <div className="container mt-4 mb-4">
        <div
          className="card p-4"
          style={{
            borderRadius: "14px",
            boxShadow: "0 2px 12px 0 rgba(44, 62, 80, 0.07)",
            border: "none",
            background: "#fff",
          }}
        >
          <h2
            className="fw-bold text-center"
            style={{
              color: "#2e7d32",
              marginBottom: "2rem",
              fontSize: "2rem",
              letterSpacing: "1px",
            }}
          >
            Añadir o Editar Característica
          </h2>
          <div>
            <CaracteristicasForm
              handlerAddCaracteristica={handlerAddCaracteristica}
              handlerCancel={handlerCancel}
              caracteristicaSelected={caracteristicaSelected}
            />
          </div>
        </div>
        {/* El listado de características y sus botones*/}
        <div className="mt-4">
          <CaracteristicaGrid
            caracteristicas={caracteristicas}
            handlerUpdate={handlerCaracteristicaSelected}
            handlerRemove={handlerRemoveCaracteristica}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminCaracteristicasApp;