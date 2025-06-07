import { useNavigate } from "react-router-dom";
import "../../Styles/AdminEstilos.css";

export const CasasDetail = ({ handlerRemove, casa = {} }) => {
  const navigate = useNavigate();

  return (
    <div className="card m-2">
      <div className="card-body">
        <h5 className="card-title">{casa.nombre}</h5>
        <p className="card-text">
          <strong>Dirección:</strong> {casa.direccion} <br />
          <strong>Ciudad:</strong> {casa.ciudad} <br />
          <strong>Descripción:</strong> {casa.descripcion} <br />
          <strong>Precio:</strong> ${casa.precio} <br />
          <p><strong>Habitaciones:</strong> {casa.numHabitaciones}</p>
          <p><strong>Baños:</strong> {casa.numBaños}</p>
          <p><strong>Email:</strong> {casa.email}</p>

        </p>

        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-update btn-sm"
              onClick={() => navigate(`/editarCasa/${casa.idCasa}`)}
            >
              Actualizar
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handlerRemove(casa.idCasa)}
            >
              Borrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
