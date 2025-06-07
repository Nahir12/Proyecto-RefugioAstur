import axios from "axios";
import authService from "./AuthService"; 

const baseUrl = "http://localhost:8080/caracteristica";

// Crear característica ( ADMIN)
export const crearCaracteristica = async (datosCaracteristica) => {
  
  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();

  if (!token) {
    console.error(" Usuario no autenticado: faltan credenciales (token es nulo o vacío).");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error(" El usuario no tiene permisos.");
    throw new Error("El usuario no tiene permisos para crear una característica.");
  }

  try {
    const respuesta = await axios.post(
      `${baseUrl}/crearCaracteristica`,
      datosCaracteristica,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Característica creada con éxito:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error(" Error al crear la característica.");
    if (error.response) {
      console.error("  Error Response Status:", error.response.status);
      console.error("  Error Response Data:", error.response.data);
      console.error("  Error Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("  Error Request:", error.request , "Halo? no hay respuesta compai");
    } else {
      console.error("  Error Message:", error.message);
    }
    console.error("  Error completo:", error);
    throw error;
  }
};

// Obtener  características(todos)
export const findAllCaracteristicas = async () => {
  const respuesta = await axios.get(`${baseUrl}/obtenerCaracteristica`);
  return respuesta.data;
};

// Actualizar característica (solo ADMIN)
export const updateCaracteristica = async (caracteristicaAActualizar) => { 

  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();

  if (!token) {
    console.error(" Usuario no autenticado: faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error(" El usuario no tiene permisos.");
    throw new Error("El usuario no tiene permisos para actualizar una característica.");
  }
  const { id, ...datosParaEnviar } = caracteristicaAActualizar;

  if (!id) {
    console.error(" ID de característica no válido ");
    throw new Error("ID de característica no válido");
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const respuesta = await axios.put(
      `${baseUrl}/actualizarCaracteristica/${id}`,
      datosParaEnviar,
      { headers }
    );
    console.log("Característica actualizada:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error(" Error al actualizar la característica.");
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


// Eliminar característica ( ADMIN)
export const removeCaracteristica = async (idCaracteristica) => {
  const token = authService.obtenerToken()?.trim();
  const esAdmin = authService.esAdmin();
  if (!token) {
    console.error("Usuario no autenticado: faltan credenciales.");
    throw new Error("Usuario no autenticado: faltan credenciales.");
  }
  if (!esAdmin) {
    console.error("El usuario no tiene permisos.");
    throw new Error("El usuario no tiene permisos para eliminar una característica.");
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`${baseUrl}/eliminarCaracteristica/${idCaracteristica}`, { headers });
    console.log(`Característica eliminada, ID: ${idCaracteristica}`);
  } catch (error) {
    console.error("Error al eliminar la característica.");
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