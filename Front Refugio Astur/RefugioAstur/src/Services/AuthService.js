import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080";
const REDIRECT_PATH_KEY = "redirectPath";

export const login = async (email, contraseña) => {
  try {
    const respuesta = await axios.post(`${API_URL}/login`, { email, contraseña });
    
    if (respuesta.data?.token) {
      // Decodificamos el token para extraer el identificador del usuario
      const decoded = jwtDecode(respuesta.data.token);
  
      if (decoded && decoded.usuarioID) {
        respuesta.data.idUsuario = decoded.usuarioID;
      }
      
      // Guardamos el objeto en localStorage 
      localStorage.setItem("usuarioLogueado", JSON.stringify(respuesta.data));
    }
    return respuesta.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem(REDIRECT_PATH_KEY);
};

export const registrar = async (nombre, email, contraseña) => {
  try {
    const datosRegistro = { nombre, email, contraseña, esTemporal: false, admin: false };
    const respuesta = await axios.post(`${API_URL}/usuario/registrar`, datosRegistro);
    return respuesta.data;
  } catch (error) {
    console.error("Error en el registro:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const obtenerUsuarioActual = () => {
  const usuarioStr = localStorage.getItem("usuarioLogueado");
  if (!usuarioStr) return null;
  try {
    const usuario = JSON.parse(usuarioStr);
  
    if (!usuario.idUsuario && usuario.id) {
      usuario.idUsuario = usuario.id;
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
    }
    return usuario;
  } catch (e) {
    console.error("Error al parsear usuarioLogueado de localStorage", e);
    localStorage.removeItem("usuarioLogueado");
    return null;
  }
};

export const estaAutenticado = () => obtenerUsuarioActual() !== null;

export const obtenerToken = () => {
  const usuario = obtenerUsuarioActual();
  const token = usuario?.token;
  return token ? token.trim() : null;
};

export const obtenerRolesDelTokenActual = () => {
  const token = obtenerToken();
  if (!token) return [];
  try {
    const decoded = jwtDecode(token);
    return decoded.authorities || decoded.roles || [];
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return [];
  }
};

export const esAdminToken = () => {
  const token = obtenerToken();
  if (token) {
    const rolesDelToken = obtenerRolesDelTokenActual();
    return rolesDelToken.includes("ROLE_ADMIN");
  }
  return false;
};

export const esAdminLegacy = () => {
  const usuario = obtenerUsuarioActual();
  return usuario && Array.isArray(usuario.roles) && usuario.roles.includes("ROLE_ADMIN");
};

export const esAdmin = () => {
  const token = obtenerToken();
  return token ? esAdminToken() : esAdminLegacy();
};

export const obtenerUsuarioIDDelToken = () => {
  const token = obtenerToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.usuarioID;
  } catch (error) {
    console.error("Error al decodificar el token en obtenerUsuarioIDDelToken:", error);
    return null;
  }
};

export const guardarRutaRedireccion = (ruta) => {
  if (ruta && ruta !== "/login" && ruta !== "/registro") {
    localStorage.setItem(REDIRECT_PATH_KEY, ruta);
  }
};

export const obtenerRutaRedireccion = () => localStorage.getItem(REDIRECT_PATH_KEY) || "/";
export const limpiarRutaRedireccion = () => localStorage.removeItem(REDIRECT_PATH_KEY);

const authService = {
  login,
  logout,
  registrar,
  obtenerUsuarioActual,
  estaAutenticado,
  esAdmin,
  esAdminToken,
  esAdminLegacy,
  obtenerToken,
  obtenerRolesDelTokenActual,
  obtenerUsuarioIDDelToken,
  guardarRutaRedireccion,
  obtenerRutaRedireccion,
  limpiarRutaRedireccion,
};

export default authService;