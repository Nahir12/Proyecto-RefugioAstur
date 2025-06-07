import { useState, useEffect } from "react";

export const CasasForm = ({ casaSelected, onChangeFields }) => {
  const [campos, setCampos] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    descripcion: "",
    precio: "",
    numHabitaciones: "",
    numBaños: "",
    email: ""
  });

  useEffect(() => {
    if (casaSelected) {
      setCampos({
        nombre: casaSelected.nombre || "",
        direccion: casaSelected.direccion || "",
        ciudad: casaSelected.ciudad || "",
        descripcion: casaSelected.descripcion || "",
        precio: casaSelected.precio || "",
        numHabitaciones: casaSelected.numHabitaciones || "",
        numBaños: casaSelected.numBaños || "",
        email: casaSelected.email || ""
      });
    } else {
      setCampos({
        nombre: "",
        direccion: "",
        ciudad: "",
        descripcion: "",
        precio: "",
        numHabitaciones: "",
        numBaños: "",
        email: ""
      });
    }
  }, [casaSelected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...campos, [name]: value };
    setCampos(updated);
    if (onChangeFields) onChangeFields(updated);
  };

  return (

    <div className="form-container p-3 bg-light rounded shadow-sm d-flex flex-column"> 

      <div className="mb-3 w-100">
        <label htmlFor="nombre" className="form-label text-dark">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="form-control"
          placeholder="Ingrese nombre de la propiedad"
          value={campos.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="direccion" className="form-label text-dark">Dirección</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          className="form-control"
          placeholder="Ingrese dirección completa"
          value={campos.direccion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="ciudad" className="form-label text-dark">Ciudad</label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          className="form-control"
          placeholder="Ingrese ciudad"
          value={campos.ciudad}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="descripcion" className="form-label text-dark">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          className="form-control"
          placeholder="Ingrese una descripción detallada"
          value={campos.descripcion}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="precio" className="form-label text-dark">Precio (mín. 10)</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            placeholder="Ingrese precio"
            value={campos.precio}
            onChange={handleChange}
            min="10"
            required
          />
        </div>
      </div>
      <div className="row g-3 mb-3 w-100">
        <div className="col-md-6">
          <label htmlFor="numHabitaciones" className="form-label text-dark">Habitaciones (mín. 1)</label>
          <input
            type="number"
            id="numHabitaciones"
            name="numHabitaciones"
            className="form-control"
            placeholder="Núm. habitaciones"
            value={campos.numHabitaciones}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="numBaños" className="form-label text-dark">Baños (mín. 1)</label>
          <input
            type="number"
            id="numBaños"
            name="numBaños"
            className="form-control"
            placeholder="Núm. baños"
            value={campos.numBaños}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>
      <div className="mb-3 w-100">
        <label htmlFor="email" className="form-label text-dark">Email de contacto</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          placeholder="Ingrese email de contacto"
          value={campos.email}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};