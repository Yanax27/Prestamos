import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los ingresos
export const fetchGetAllIngresos = async (idCuenta) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/ingreso?CuentumIdCuenta=${idCuenta}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching ingresos:", error);
      throw error;
    }
  };
  
  // Obtener un ingreso por ID
  export const fetchGetIngresoById = async (id) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/ingreso/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ingreso with ID ${id}:`, error);
      throw error;
    }
  };

   // Agregar un ingreso por ID
  export const fetchPostIngreso = async (ingresoData) => {
    try {
      const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/ingreso/`, ingresoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear el ingreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };

 // Actualizar un ingreso por ID
  export const fetchPutIngreso = async (id, ingresoData) => {
    try {
      const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/ingreso/${id}`, ingresoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar el ingreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    // Elimiar un ingreso por ID
  export const fetchDeleteIngreso = async (id) => {
    try {
      const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/ingreso/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar el ingreso: ${error.response ? error.response.data.message : error.message}`);
    }
  };