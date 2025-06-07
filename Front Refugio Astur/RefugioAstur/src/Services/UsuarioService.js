import axios from "axios";

const baseUrl = "http://localhost:8080/usuario";

// Obtener todos los usuarios
export const findAllUsuarios = async () => {
  try {
    const response = await axios.get(`${baseUrl}/obtenerUsuarios`);
    return response;
  } catch (error) {
    console.error("Error a la hora de obtener usuarios:", error);
    return null;
  }
};

// Borrar usuario
export const removeUsuario = async (id) => {
  if (!id) {
    console.error("El id para eliminar el usuario es undefined.");
    return;
  }
  try {
    await axios.delete(`${baseUrl}/eliminarUsuario/${id}`);
  } catch (error) {
    console.error("Error al borrar el usuario:", error);
  }
};

// Actualizar perfil de usuario
export const actualizarMiPerfil = async (idUsuario, datosActualizados) => {
  if (!idUsuario || !datosActualizados) {
    console.error("Faltan datos para actualizar el perfil.");
    return;
  }
  try {
    const response = await axios.put(`${baseUrl}/actualizarPerfil/${idUsuario}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    throw error;
  }
};

//
const usuarioService = {
  findAllUsuarios,
  removeUsuario,
  actualizarMiPerfil, 
};

export default usuarioService;
