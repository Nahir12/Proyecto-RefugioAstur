import { useState } from "react";

const ImagenesForm = ({
  imagenesExistentes,
  bloquesImagenes,
  setBloquesImagenes,
  onActualizarImagen,
  onEliminarImagen,
  onAsociarImagen,
}) => {
  const [url, setUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleAgregarBloque = () => {
    if (!url.trim()) return;
    const nuevaImagen = { url, descripcion };
    setBloquesImagenes([...bloquesImagenes, nuevaImagen]);
    setUrl("");
    setDescripcion("");
  };

  return (
    <div>
      <h5>Imágenes existentes</h5>
      {imagenesExistentes && imagenesExistentes.length > 0 ? (
        imagenesExistentes.map((img, index) => (
          <div
            key={img.idImagen ? img.idImagen : `existing-${index}`}
            className="d-flex align-items-center mb-2"
          >
            <img
              src={img.url_imagen} 
              alt={`Imagen ${img.idImagen ? img.idImagen : index}`}
              style={{
                maxWidth: "150px",
                marginRight: "10px",
                borderRadius: "5px",
              }}
            />
            <div>
              <p className="mb-0">
                <strong>Descripción:</strong> {img.descripcion}
              </p>
              <p className="mb-0">
                <strong>URL:</strong> {img.url_imagen}
              </p>
            </div>
            <div className="ms-auto">
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onActualizarImagen(img)}
              >
                Actualizar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onEliminarImagen(img)}
              >
                Borrar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay imágenes asociadas a la casa.</p>
      )}

      <hr />

      <h5>Añadir nueva imagen</h5>
      <div className="mb-3">
        <label>URL de la imagen:</label>
        <input
          type="text"
          className="form-control"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Descripción:</label>
        <input
          type="text"
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button className="btn btn-secondary mb-3" onClick={handleAgregarBloque}>
        Agregar imagen (pendiente)
      </button>

      {bloquesImagenes && bloquesImagenes.length > 0 &&
        bloquesImagenes.map((img, index) => (
          <div key={`new-${index}`} className="d-flex align-items-center mb-2">
            <span className="me-2">
              Nueva Imagen - URL: {img.url || "Sin definir"} | Descripción:{" "}
              {img.descripcion || "Sin definir"}
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAsociarImagen(index)}
            >
              Asociar Imagen
            </button>
          </div>
        ))}
    </div>
  );
};

export default ImagenesForm;
