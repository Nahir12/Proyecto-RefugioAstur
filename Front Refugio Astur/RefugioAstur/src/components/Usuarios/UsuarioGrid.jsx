import { UsuarioDetail } from "./UsuarioDetail";
import "../../Styles/AdminEstilos.css"; 

export const UsuarioGrid = ({ usuarios = [], handlerRemove }) => {
  return (
    <div className="container" style={{ backgroundColor: "#EEEEEE", padding: "20px" }}>
      <div className="row">
        {usuarios.map((usuario) => (
          <div className="col-md-6" key={usuario.id}>
            <UsuarioDetail handlerRemove={handlerRemove} usuario={usuario} />
          </div>
        ))}
      </div>
    </div>
  );
};
