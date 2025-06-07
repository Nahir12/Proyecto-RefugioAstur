import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RefugioAsturApp from "./components/RefugioAsturApp";
import LoginUsuariosApp from "./components/Pages/logginUsuariosApp";
import RegisterUserApp from "./components/Pages/RegisterUserApp";
import CasaDetalle from "./components/Pages/CasaDetalle";
import UsuarioTemporal from "./components/usuarios/UsuarioTemporal";  
import { AdminCasasApp } from "./components/Pages/AdminCasasApp";
import AdminPanelApp from "./components/Pages/AdminPanelApp";
import { AdminCaracteristicasApp } from "./components/Pages/AdminCaracterisicasApp";
import PerfilUsuarioApp from "./components/Pages/PerfilUsuarioApp";
import CasaEdit from "./components/Casas/CasasEdit";
import CasasListado from "./components/Pages/CasasListado";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RefugioAsturApp />} />
        <Route path="/login" element={<LoginUsuariosApp />} />
        <Route path="/registro" element={<RegisterUserApp />} />
        <Route path="/casa/:idCasa" element={<CasaDetalle />} />
        <Route path="/detalle-casa/:idCasa" element={<CasaDetalle />} />
        <Route path="/usuario-temporal" element={<UsuarioTemporal />} />
        <Route path="/perfil" element={<PerfilUsuarioApp />} />
        <Route path="/admin/panel" element={<AdminPanelApp />} />
        <Route path="/admin-casas" element={<AdminCasasApp />} />
        <Route path="/admin/caracteristicas" element={<AdminCaracteristicasApp />} />
        <Route path="/Casas/CasasEdit/:idCasa" element={<CasaEdit />} />
        <Route path="/casas-listado" element={<CasasListado />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);