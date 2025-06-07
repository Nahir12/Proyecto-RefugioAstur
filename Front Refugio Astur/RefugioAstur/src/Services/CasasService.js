import axios from "axios";
import authService from "./AuthService";

const baseUrl = "http://localhost:8080/casa";
const baseUrlImagenes = "http://localhost:8080/imagenesCasa";

// Función auxiliar para obtener tokens
const obtenerCabecerasAutenticadas = () => {
  const token = authService.obtenerToken()?.trim();
  if (!token) throw new Error("Usuario no autenticado: faltan credenciales");
  return { Authorization: `Bearer ${token}` };
};

// crear casa admin
export const crearCasa = async (datosCasa) => {
  console.log("intento", datosCasa);
  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();

  if (!token) {
    console.error("Error al crear casa: usuario no autenticado");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error("Error al crear casa: el usuario no tiene permisos de ADMIN");
    throw new Error("El usuario no tiene permisos para crear una casa.");
  }
  try {
    const respuesta = await axios.post(`${baseUrl}/crearCasa`,
      datosCasa,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Casa creada con éxito:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error("Error al crear la casa.", error);
    throw error;
  }
};

// obtener casas todos
export const findAllCasas = async () => {
  const respuesta = await axios.get(`${baseUrl}/obtenerCasas`);
  return respuesta.data;
};

//filtrar  todos
export const filterCasas = async (params = {}) => {
  const respuesta = await axios.get(`${baseUrl}/buscarCasasFiltro`, { params });
  return respuesta.data;
};

// actualizar amin
export const updateCasa = async ({ idCasa, ...datosCasa }) => {
  const token = authService.obtenerToken()?.trim();
  if (!token) {
    console.error("Usuario no autenticado: faltan credenciales para actualizar la casa.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }

  try {
    const respuesta = await axios.put(`${baseUrl}/actualizarCasa/${idCasa}`,
      datosCasa,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return respuesta.data;
  } catch (error) {
    console.error("Error al actualizar la casa:", error);
    throw error;
  }
};

// borrar cassa admin
export const removeCasa = async (idCasa) => {
  await axios.delete(`${baseUrl}/eliminarCasa/${idCasa}`, {
    headers: obtenerCabecerasAutenticadas(),
  });
};


// obtener casa todos
export const getCasaById = async (idCasa) => {
  try {
    console.log(`Llamada a getCasaById para idCasa: ${idCasa}`);
    const respuesta = await axios.get(`${baseUrl}/obtenerCasa/${idCasa}`);
    console.log("Datos recibidos en getCasaById:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error("Error en getCasaById:", error.response?.data || error.message);
    throw error;
  }
};

// IMAGENES

// ontener imagenes todos
export const findImagenesCasa = async (idCasa) => {
  try {
    console.log("Llamada a findImagenesCasa para casa:", idCasa);
    const respuesta = await axios.get(`${baseUrlImagenes}/obtener/${idCasa}`);
    console.log("Datos recibidos en findImagenesCasa para casa", idCasa, ":", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error("Error en findImagenesCasa para casa", idCasa, ":", error.response?.data || error.message);
    throw error;
  }
};

// crear imagen solo ADMIN
export const crearImagenCasa = async (datosImagen) => {
  try {
    const headers = obtenerCabecerasAutenticadas();
    const respuesta = await axios.post(
      `${baseUrlImagenes}/crearImagenCasa`,
      datosImagen,
      { headers }
    );
    return respuesta.data;
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    throw error;
  }
};

// actualizar img solo admin
export const actualizarImagenCasa = async (idImagen, datosImagen) => {
  try {
    const headers = obtenerCabecerasAutenticadas();
    const respuesta = await axios.put(
      `${baseUrlImagenes}/actualizarImagen/${idImagen}`,
      datosImagen,
      { headers }
    );
    return respuesta.data;
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    throw error;
  }
};

// eliminar img solo admin
export const eliminarImagenCasa = async (idImagen) => {
  try {
    const headers = obtenerCabecerasAutenticadas();
    await axios.delete(`${baseUrlImagenes}/eliminarImagen/${idImagen}`, { headers });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    throw error;
  }
};
