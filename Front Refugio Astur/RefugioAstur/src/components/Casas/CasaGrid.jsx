export const CasasGrid = ({ handlerUpdate, handlerRemove, casas = [] }) => {
  return (
    <div className="container" style={{ backgroundColor: "#EEEEEE", padding: "20px" }}>
      <div className="row">
        {casas.map((casa) => {
          return (
            <div className="col-md-6" key={casa.idCasa}>
              <CasasDetail handlerUpdate={handlerUpdate} handlerRemove={handlerRemove} casa={casa} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
