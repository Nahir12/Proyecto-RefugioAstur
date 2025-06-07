import  { useState, useMemo } from "react";

const CasaCaracteristicasForm = ({
  caracteristicasDisponibles,
  caracteristicasAsociadas,
  onAddCaracteristicas,
  onRemoveCaracteristica,
}) => {
  const opcionesNoAsociadas = useMemo(() => {
    return caracteristicasDisponibles.filter(
      (carac) => !caracteristicasAsociadas.includes(carac.idCaracteristica)
    );
  }, [caracteristicasDisponibles, caracteristicasAsociadas]);

  const [selected, setSelected] = useState([]);

  const cambioCheckbox = (e) => {
    const id = Number(e.target.value);
    if (e.target.checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleAdd = () => {
    if (selected.length > 0) {
      onAddCaracteristicas(selected);
      setSelected([]);
    }
  };

  return (
    <div className="mt-4">
      {/* características asociadas */}
      <div>
        <h4>Características Asociadas</h4>
        {caracteristicasAsociadas && caracteristicasAsociadas.length > 0 ? (
          caracteristicasDisponibles
            .filter((carac) =>
              caracteristicasAsociadas.includes(carac.idCaracteristica)
            )
            .map((carac) => (
              <div
                key={carac.idCaracteristica}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <div>
                  <strong>{carac.nombre}</strong>
                  <p className="mb-0">{carac.descripcion}</p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onRemoveCaracteristica(carac.idCaracteristica)}
                >
                  Borrar
                </button>
              </div>
            ))
        ) : (
          <p>No hay características asociadas.</p>
        )}
      </div>

      <hr />

      {/*  agregar nuevas características */}
      <div>
        <h4>Agregar Características</h4>
        {opcionesNoAsociadas && opcionesNoAsociadas.length > 0 ? (
          opcionesNoAsociadas.map((carac) => (
            <div key={carac.idCaracteristica} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                value={carac.idCaracteristica}
                onChange={cambioCheckbox}
                checked={selected.includes(carac.idCaracteristica)}
              />
              <label className="form-check-label">
                {carac.nombre} - {carac.descripcion}
              </label>
            </div>
          ))
        ) : (
          <p>No hay características disponibles para agregar.</p>
        )}
        {selected.length > 0 && (
          <button className="btn btn-primary mt-3" onClick={handleAdd}>
            Agregar Característica{selected.length > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
};

export default CasaCaracteristicasForm;
