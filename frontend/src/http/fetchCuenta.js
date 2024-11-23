import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los cuentas
export const fetchGetAllCuentas = async () => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/cuenta/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cuentas:", error);
      throw error;
    }
  };
  
  // Obtener un cuenta por ID
  export const fetchGetCuentaById = async (id) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/cuenta/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching cuenta with ID ${id}:`, error);
      throw error;
    }
  };

   // Agregar un cuenta por ID
  export const fetchPostCuenta = async (cuentaData) => {
    try {
      const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/cuenta/`, cuentaData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear el cuenta: ${error.response ? error.response.data.message : error.message}`);
    }
  };

 // Actualizar un cuenta por ID
  export const fetchPutCuenta = async (id, cuentaData) => {
    try {
      const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/cuenta/${id}`, cuentaData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar el cuenta: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    // Elimiar un cuenta por ID
  export const fetchDeleteCuenta = async (id) => {
    try {
      const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/cuenta/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar el cuenta: ${error.response ? error.response.data.message : error.message}`);
    }
  };