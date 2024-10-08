import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los prestarios
export const fetchGetAllPrestarios = async () => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/prestario/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching prestarios:", error);
      throw error;
    }
  };
  
  // Obtener un prestario por ID
  export const fetchGetPrestarioById = async (id) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/prestario/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching prestario with ID ${id}:`, error);
      throw error;
    }
  };

   // Agregar un prestario por ID
  export const fetchPostPrestario = async (prestarioData) => {
    try {
      const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/prestario/`, prestarioData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear el prestario: ${error.response ? error.response.data.message : error.message}`);
    }
  };

 // Actualizar un prestario por ID
  export const fetchPutPrestario = async (id, prestarioData) => {
    try {
      const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/prestario/${id}`, prestarioData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar el prestario: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    // Elimiar un prestario por ID
  export const fetchDeletePrestario = async (id) => {
    try {
      const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/prestario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar el prestario: ${error.response ? error.response.data.message : error.message}`);
    }
  };