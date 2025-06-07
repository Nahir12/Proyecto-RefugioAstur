import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCasaById,
  updateCasa,
  crearImagenCasa,
  actualizarImagenCasa,
  eliminarImagenCasa,
  findImagenesCasa,
} from "../../Services/CasasService";
import {
  createCasaCaracteristica,
  removeCasaCaracteristica,
  getCaracteristicasCasa,
} from "../../Services/CasaCaracteristicaService";
import { findAllCaracteristicas } from "../../Services/CaracteristicasService";

import { CasasForm } from "../Casas/CasasForm";
import CasaCaracteristicasForm from "../Casas/CasaCaracteristicasForm";
import CasaImagenesForm from "../Casas/ImagenesForm";


const CasaEdit = () => {
  const { idCasa } = useParams();
  const navigate = useNavigate();
//Casas
  const [casaData, setCasaData] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  //   imágenes
  const [imagenesCasa, setImagenesCasa] = useState([]);
  const [bloquesImagenes, setBloquesImagenes] = useState([]);
  // características
  const [caracDisponibles, setCaracDisponibles] = useState([]);
  const [caracAsociadas, setCaracAsociadas] = useState([]);

  // Cargar los datos casa.
  const fetchCasa = async () => {
    try {
      const data = await getCasaById(idCasa);
      setCasaData(data);
      setUpdatedFields({
        nombre: data.nombre,
        direccion: data.direccion,
        ciudad: data.ciudad,
        descripcion: data.descripcion,
        precio: data.precio,
        numHabitaciones: data.numHabitaciones,
        numBaños: data.numBaños,
        email: data.email,
      });
      if (data.caracteristicas) {
        setCaracAsociadas(data.caracteristicas.map((c) => c.idCaracteristica));
      }
    } catch (error) {
      console.error("Error al cargar la casa:", error);
    }
  };

  // imágenes asociadas a la casa
  const fetchImagenesCasa = async () => {
    try {
      const imgs = await findImagenesCasa(idCasa);
      console.log("Imágenes recibidas:", imgs);
      setImagenesCasa(imgs);
    } catch (error) {
      console.error("Error al obtener las imágenes:", error);
    }
  };

  // características casa
  const fetchCaracteristicas = async () => {
    try {
      const caracs = await getCaracteristicasCasa(idCasa);
      setCaracAsociadas(caracs.map((c) => c.idCaracteristica));
    } catch (error) {
      console.error("Error al obtener características:", error);
    }
  };

  // características disponibles
  const fetchCaracteristicasDisponibles = async () => {
    try {
      const resp = await findAllCaracteristicas();
      const lista = Array.isArray(resp) ? resp : resp?.data || [];
      setCaracDisponibles(lista);
    } catch (error) {
      console.error("Error al cargar características disponibles:", error);
    }
  };

  useEffect(() => {
    fetchCasa();
    fetchImagenesCasa();
    fetchCaracteristicas();
    fetchCaracteristicasDisponibles();
  }, [idCasa]);

  // Actualización  datos
  const handleCambios = (fields) => {
    setUpdatedFields(fields);
  };

  const handleActualizarCasa = async () => {
    try {
      const updatedCasa = { ...casaData, ...updatedFields };
      await updateCasa(updatedCasa);
      alert("Casa actualizada con éxito");
      navigate("/admin-casas");
    } catch (error) {
      console.error("Error al actualizar casa:", error);
      alert("Error al actualizar la casa");
    }
  };

  //Imagenes

  // Actualizar imagen
  const handleActualizarImagen = async (img) => {
    if (!img.idImagen && !img.idImagenes) {
      alert("Error: imagen sin id válido.");
      return;
    }
    try {
      // Prompt para la nueva URL
      const newUrl = prompt("Ingrese la nueva URL para la imagen:", img.url_imagen);
      if (newUrl === null) return;
      // Prompt para la nueva descripción
      const newDescripcion = prompt("Ingrese la nueva descripción para la imagen:", img.descripcion);
      if (newDescripcion === null) return;
      
      await actualizarImagenCasa(img.idImagen || img.idImagenes, {
        url_imagen: newUrl,
        descripcion: newDescripcion,
      });
      alert("Imagen actualizada con éxito.");
      fetchImagenesCasa();
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      alert("Error al actualizar la imagen");
    }
  };

  const handleEliminarImagen = async (img) => {
    if (!img.idImagen && !img.idImagenes) {
      alert("Error: imagen sin id válido.");
      return;
    }
    try {
      await eliminarImagenCasa(img.idImagen || img.idImagenes);
      alert("Imagen eliminada con éxito.");
      fetchImagenesCasa();
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      alert("Error al eliminar la imagen");
    }
  };

  const handleAsociarImagen = async (index) => {
    const imagen = bloquesImagenes[index];
    const payload = {
      idCasa: casaData.idCasa,
      urlImagen: imagen.url,
      descripcion: imagen.descripcion,
    };
    try {
      await crearImagenCasa(payload);
      alert("Imagen asociada con éxito.");
      setBloquesImagenes((prev) => prev.filter((_, i) => i !== index));
      fetchImagenesCasa();
    } catch (error) {
      console.error("Error al asociar la imagen:", error);
      alert("Error al asociar la imagen");
    }
  };

  // características
  const handleAddCaracteristicas = async (selectedIds) => {
    for (const idCarac of selectedIds) {
      try {
        await createCasaCaracteristica({ idCasa: casaData.idCasa, idCaracteristica: idCarac });
      } catch (error) {
        console.error("Error al agregar característica:", error);
      }
    }
    fetchCaracteristicas();
  };

  const handleRemoveCaracteristica = async (idCarac) => {
    try {
      await removeCasaCaracteristica({ idCasa: casaData.idCasa, idCaracteristica: idCarac });
    } catch (error) {
      console.error("Error al eliminar característica:", error);
    }
    fetchCaracteristicas();
  };

  if (!casaData) return <p>Cargando datos...</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ color: "#2E7D32" }}>Editar Casa</h2>
      <div className="card shadow mb-4">
        <div className="card-header bg-success text-white">Datos Básicos de la Casa</div>
        <div className="card-body">
          <CasasForm casaSelected={casaData} onChangeFields={handleCambios} />
        </div>
      </div>
      
      <div className="card shadow mb-4">
        <div className="card-header bg-info text-white">Imágenes de la Casa</div>
        <div className="card-body">
          <CasaImagenesForm
            imagenesExistentes={imagenesCasa}
            bloquesImagenes={bloquesImagenes}
            setBloquesImagenes={setBloquesImagenes}
            onActualizarImagen={handleActualizarImagen}
            onEliminarImagen={handleEliminarImagen}
            onAsociarImagen={handleAsociarImagen}
          />
        </div>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header bg-secondary text-white">Características de la Casa</div>
        <div className="card-body">
          <CasaCaracteristicasForm
            caracteristicasDisponibles={caracDisponibles}
            caracteristicasAsociadas={caracAsociadas}
            onAddCaracteristicas={handleAddCaracteristicas}
            onRemoveCaracteristica={handleRemoveCaracteristica}
          />
        </div>
      </div>
      
      <button className="btn btn-success w-100" onClick={handleActualizarCasa}>
        Actualizar Casa
      </button>
    </div>
  );
};

export default CasaEdit;
