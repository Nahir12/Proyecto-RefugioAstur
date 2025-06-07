export const UsuarioDetail = ({ handlerRemove, usuario = {} }) => {
  return (
    <div className="card m-2">
      <div className="card-body">
        <h5 className="card-title">{usuario.nombre}</h5>
        <p className="card-text">Email: {usuario.email}</p>
        <p className="card-text">Tipo de Usuario: {usuario.tipo_usuario}</p>
        <p className="card-text">Cuenta Temporal: {usuario.esTemporal ? "Sí" : "No"}</p>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handlerRemove(usuario.id)}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};
