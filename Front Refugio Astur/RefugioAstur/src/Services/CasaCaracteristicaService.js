import axios from "axios";
import authService from "./AuthService";

const baseUrl = "http://localhost:8080/casaCaracteristica";
const baseUrlCar = "http://localhost:8080/caracteristica";

// Obtener las características casas todos
export const getCaracteristicasCasa = async (idCasa) => {
  try {
    const response = await axios.get(
      `${baseUrl}/buscarCaracteristicasPorCasa/${idCasa}`
    );
    console.log("Características obtenidas:",response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las características de la casa:", error );
  }
  return [];
};

// Crear casa carct (Solo ADMIN)
export const createCasaCaracteristica = async (datos) => {
  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();

  if (!token) {
    console.error("faltan credenciales" );
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error( " El usuario no tiene permisos para crear casaCarats.");
    throw new Error(
      "El usuario no tiene permisos para crear la casaCarats."
    );
  }

  try {
    const respuesta = await axios.post(`${baseUrl}/crearCasaCaracteristica`,datos,{ headers: { Authorization: `Bearer ${token}` } });
    console.log("Creada con éxito:",respuesta.data );
    return respuesta.data;
  } catch (error) {
    console.error("Error al crear  casaCar");
    if (error.response) {
      console.error("  Error Response Status:", error.response.status);
      console.error("  Error Response Data:", error.response.data);
      console.error("  Error Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error(
        "  Error Request:",
        error.request,
        "Bueno, a ver, si nadie responde yo me voy eh"
      );
    } else {
      console.error("  Error Message:", error.message);
    }
    console.error("  Error completo:", error);
    throw error;
  }
};

// Eliminar ( ADMIN)
export const removeCasaCaracteristica = async (datos) => {

  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();

  if (!token) {
    console.error("Usuario no autenticado: faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error("El usuario no tiene permisos para eliminar la relación.");
    throw new Error(
      "El usuario no tiene permisos para eliminar la relación casa-característica."
    );
  }

  try {
    await axios.delete(`${baseUrl}/eliminarCasaCaracteristica`, {data: datos,  headers: { Authorization: `Bearer ${token}` }, });
    
    console.log(" eliminada correctamente." );

  } catch (error) {
    console.error(
      " Error al eliminarCasaCaracteristica."
    );
    if (error.response) {
      console.error("  Error Response Status:", error.response.status);
      console.error("  Error Response Data:", error.response.data);
      console.error("  Error Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("  Error Request:", error.request);
    } else {
      console.error("  Error Message:", error.message);
    }
    console.error("  Error completo:", error);
    throw error;
  }
};

// Obtener todas las características (todos))
export const getAllCaracteristicas = async () => {
  try {
    const response = await axios.get(`${baseUrlCar}/obtenerCaracteristicas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las características:", error);
  }
  return [];
};
