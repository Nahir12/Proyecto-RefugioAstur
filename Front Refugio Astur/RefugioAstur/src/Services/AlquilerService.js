import axios from "axios";
import authService from "./AuthService";

const baseUrl = "http://localhost:8080/alquiler";

// Crear alquiler (público)
export const crearAlquiler = async (alquilerData) => {
  try {
    console.log(" Intentando crearAlquiler con datos:", alquilerData);
    const response = await axios.post(`${baseUrl}/crearAlquiler`, alquilerData);
    console.log("lquiler creado con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error al crear alquiler.", error);
    throw error;
  }
};

// Obtener  alquileres (USER o ADMIN)
export const obtenerAlquileres = async () => {
  const token = authService.obtenerToken()?.trim();
  if (!token) {
    console.error("Usuario no autenticado, faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  try {
    const response = await axios.get(`${baseUrl}/ObtenerAlquileres`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Alquileres obtenidos con éxito");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los alquileres.", error);
    throw error;
  }
};

// Eliminar un alquiler (USER o ADMIN)
export const eliminarAlquiler = async (idAlquiler) => {
  const token = authService.obtenerToken()?.trim();
  if (!token) {
    console.error("Usuario no autenticado, faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  try {
    await axios.delete(`${baseUrl}/eliminarAlquiler/${idAlquiler}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Alquiler eliminado, ID: ${idAlquiler}`);
  } catch (error) {
    console.error("Error al eliminar el alquiler.", error);
    throw error;
  }
};

//  precio total(público)

export const sacarTotal = async (idCasa, fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${baseUrl}/sacarTotal/${idCasa}`, {
      params: { fechaInicio, fechaFin },
    });
    console.log(" Precio total calculado correctamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al calcular el precio total.", error);
    throw error;
  }
};

// Obtener alquileres por usuario (USER)
export const obtenerAlquileresPorUsuario = async (usuarioID) => {
  const token = authService.obtenerToken()?.trim();
  if (!token) {
    console.error("[ERROR] AlquilerService (obtenerAlquileresPorUsuario): Usuario no autenticado, faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  try {
    const response = await axios.get(`${baseUrl}/alquilerUsuario/${usuarioID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Alquileres obtenidos con éxito.");
    return response.data;
  } catch (error) {
    console.error("Error al obtener alquileres por usuario.", error);
    throw error;
  }
};

export default {
  crearAlquiler,
  obtenerAlquileres,
  eliminarAlquiler,
  sacarTotal,
  obtenerAlquileresPorUsuario,
};
