import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los egresos
export const fetchGetAllEgresos = async (idCuenta) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/egreso?CuentumIdCuenta=${idCuenta}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching egresos:", error);
      throw error;
    }
  };
  
  // Obtener un egreso por ID
  export const fetchGetEgresoById = async (id) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/egreso/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching egreso with ID ${id}:`, error);
      throw error;
    }
  };

   // Agregar un egreso por ID
  export const fetchPostEgreso = async (egresoData) => {
    try {
      const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/egreso/`, egresoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear el egreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };

 // Actualizar un egreso por ID
  export const fetchPutEgreso = async (id, egresoData) => {
    try {
      const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/egreso/${id}`, egresoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar el egreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    // Elimiar un egreso por ID
  export const fetchDeleteEgreso = async (id) => {
    try {
      const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/egreso/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar el egreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };