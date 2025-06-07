import { useState, useEffect } from "react";

export const CaracteristicasForm = ({
  handlerAddCaracteristica,
  handlerCancel,
  caracteristicaSelected,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Si se selecciona una característica para editar, actualiza los inputs
  useEffect(() => {
    setNombre(caracteristicaSelected ? caracteristicaSelected.nombre : "");
    setDescripcion(caracteristicaSelected ? caracteristicaSelected.descripcion || "" : "");
  }, [caracteristicaSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim() === "" || descripcion.trim() === "") return;
    handlerAddCaracteristica({
      ...(caracteristicaSelected ? caracteristicaSelected : {}),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
    setNombre("");
    setDescripcion("");
  };

  const handleCancel = () => {
    setNombre("");
    setDescripcion("");
    handlerCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)",
        border: "1px solid #b7e4c7",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <div className="mb-3">
        <label
          htmlFor="nombre"
          style={{
            color: "#2e7d32",
            fontWeight: 600,
            marginBottom: "0.5rem",
            display: "block",
            fontSize: "1.1rem",
          }}
        >
          Nombre de la característica
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #b7e4c7",
            padding: "8px 12px",
            fontSize: "1rem",
            background: "#fff",
            color: "#222",
          }}
          autoComplete="off"
          required
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="descripcion"
          style={{
            color: "#2e7d32",
            fontWeight: 600,
            marginBottom: "0.5rem",
            display: "block",
            fontSize: "1.1rem",
          }}
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #b7e4c7",
            padding: "8px 12px",
            fontSize: "1rem",
            background: "#fff",
            color: "#222",
            resize: "vertical",
            minHeight: "60px",
          }}
          required
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button
          type="submit"
          style={{
            background: "#2e7d32",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "8px 18px",
            border: "none",
            boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)",
            fontSize: "1rem",
          }}
        >
          {caracteristicaSelected ? "Actualizar" : "Añadir"}
        </button>
        {caracteristicaSelected && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: "#b7e4c7",
              color: "#2e7d32",
              fontWeight: 600,
              borderRadius: "8px",
              padding: "8px 18px",
              border: "none",
              fontSize: "1rem",
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};