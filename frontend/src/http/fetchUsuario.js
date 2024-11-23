import axios from "axios";
import config from "../config";

// Obtener todos los usuarios
export const fetchGetAllUsuarios = async (email) => {
  try {
    const response = await axios.get(
      `${config.typeRequest}://${config.apiUrl}/usuario?email=${email}`,
      {
        withCredentials: true, // Enviar cookies al servidor
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const fetchGetUsuarioById = async (id) => {
  try {
    const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/usuario/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching usuario with ID ${id}:`, error);
    throw error;
  }
};

// Agregar un usuario
export const fetchPostUsuario = async (usuarioData) => {
  try {
    const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/`, usuarioData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear el usuario: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Actualizar un usuario por ID
export const fetchPutUsuario = async (id, usuarioData) => {
  try {
    const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/usuario/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar el usuario: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Eliminar un usuario por ID
export const fetchDeleteUsuario = async (id) => {
  try {
    const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/usuario/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el usuario: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Iniciar sesión
export const fetchLogin = async (credentials) => {
  try {
    const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/login`, credentials, {
      withCredentials: true, // Para enviar cookies al servidor
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al iniciar sesión: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Cerrar sesión
export const fetchLogout = async () => {
  try {
    const response = await axios.post(
      `${config.typeRequest}://${config.apiUrl}/usuario/logout`,
      {},
      {
        withCredentials: true, // Enviar cookies si están presentes
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.warn("No autenticado: ya estás desconectado");
      return; // No lances un error si el usuario ya está desconectado
    }
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
};

// Validar token
export const fetchValidateToken = async () => {
  try {
    const response = await axios.post(
      `${config.typeRequest}://${config.apiUrl}/usuario/validate/token`,
      {},
      {
        withCredentials: true, // Asegura que se envíen las cookies
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("No autenticado");
    }
    throw new Error(`Error al validar el token: ${error.message}`);
  }
};

