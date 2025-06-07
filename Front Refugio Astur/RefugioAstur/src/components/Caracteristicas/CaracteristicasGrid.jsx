import { CaracteristicaDetail } from "./CaracteristicasDetail";
import "../../Styles/AdminEstilos.css"; 

export const CaracteristicaGrid = ({ handlerUpdate, handlerRemove, caracteristicas = [] }) => {
  return (
  
    <div
      className="container"
      style={{ backgroundColor: "#EEEEEE", padding: "20px" }}
    >
      <div className="row">
        {caracteristicas.map((caracteristica) => (
          <div className="col-md-6" key={caracteristica.id}>
            <CaracteristicaDetail
              handlerUpdate={handlerUpdate}
              handlerRemove={handlerRemove}
              caracteristica={caracteristica}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
