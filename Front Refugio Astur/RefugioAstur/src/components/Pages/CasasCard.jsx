import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findImagenesCasa } from "../../Services/CasasService";
import "../../Styles/AdminEstilos.css";

const CasaCard = ({ casa }) => {
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);
  const domain = "http://localhost:5173";

  // Definir la imagen por defecto 
  const defaultImage = `${domain}/imagenes/sinImagenes.png`;

  // URL relativa en una absoluta o x defecto
  const getImageUrl = (url) => {
    if (typeof url !== "string" || !url) {
      return defaultImage;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
      return url;
    }
    return `${domain}${url}`;
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imgs = await findImagenesCasa(casa.idCasa);
        if (Array.isArray(imgs) && imgs.length > 0) {
          setImagenes(imgs);
        }
      } catch (error) {
        console.error("Error al cargar imágenes para la casa", casa.idCasa, error);
      }
    };
    loadImages();
  }, [casa.idCasa]);

  return (
    <div className="card m-2">
      {imagenes && imagenes.length > 0 ? (
        <div className="text-center">
          <img
            src={getImageUrl(imagenes[0].urlImagen)}
            className="img-fluid"
            alt={imagenes[0].descripcion || `Imagen de ${casa.nombre}`}
          />
        </div>
      ) : (
        <div className="text-center">
          <img
            src={defaultImage}
            className="img-fluid"
            alt="Sin imágenes disponibles"
          />
        </div>
      )}

      <div className="card-body">
        <h5 className="card-title">{casa.nombre || "Casa sin nombre"}</h5>
        <p className="card-text">
          {casa.descripcion
            ? casa.descripcion.length > 100
              ? casa.descripcion.substring(0, 100) + "..."
              : casa.descripcion
            : "Sin descripción disponible."}
        </p>
        <button
          className="btn btn-success"
          onClick={() => navigate(`/casa/${casa.idCasa}`)}
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
};

export default CasaCard;
