export const CaracteristicaDetail = ({
  handlerUpdate,
  handlerRemove,
  caracteristica = {},
}) => {
  return (
    // Se usa una estructura de "card" para mostrar cada característica en su propio espacio.
    <div className="card m-2">
      <div className="card-body">
        <h5 className="card-title">{caracteristica.nombre}</h5>
        <p className="card-text">{caracteristica.descripcion}</p>
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-update btn-sm"
              onClick={() => handlerUpdate(caracteristica)}
            >
              Actualizar
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handlerRemove(caracteristica.id)}
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
