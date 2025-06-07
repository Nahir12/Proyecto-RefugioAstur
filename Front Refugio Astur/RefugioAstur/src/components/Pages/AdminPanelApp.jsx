import { Link, Navigate } from 'react-router-dom';
import authService from '../../Services/AuthService';
import HeaderApp from '../Layout/HeaderApp';

const AdminPanelApp = () => {
  if (!authService.estaAutenticado() || !authService.esAdmin()) {
    return <Navigate to="/login" state={{ from: '/admin/panel' }} replace />;
  }

  return (
    <>
      <HeaderApp titulo="Panel de Administración" />
      <div className="container mt-4">
        <div className="p-5 mb-4 bg-light rounded-3" style={{border: '1px solid #A5D6A7'}}>
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold" style={{color: '#1B5E20'}}>Panel de Administración</h1>
            <p className="col-md-8 fs-4 text-muted">
              Bienvenido al panel de administración de Refugio Astur. Comience a gestionar las propiedades y características de la plataforma.
            </p>
          </div>
        </div>
        
        <div className="row align-items-md-stretch">
          <div className="col-md-6 mb-3">
            <div className="h-100 p-4 text-bg-success rounded-3 shadow-sm" style={{backgroundColor: '#4CAF50 !important'}}>
              <h2>Gestionar Casas</h2>
              <p>Añade, edita o elimina las propiedades disponibles en la plataforma.</p>
              <Link to="/admin-casas" className="btn btn-outline-light">
                Ir a Gestión de Casas
              </Link>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="h-100 p-4 bg-warning-subtle border rounded-3 shadow-sm">
              <h2>Gestionar Características</h2>
              <p>Define y administra las comodidades y características de las casas.</p>
              <Link to="/admin/caracteristicas" className="btn btn-outline-dark">
                Ir a Gestión de Características
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanelApp;