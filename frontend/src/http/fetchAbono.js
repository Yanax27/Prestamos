import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los abonos
export const fetchGetAllAbonos = async () => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/abono/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching abonos:", error);
      throw error;
    }
  };
  
  // Obtener un abono por ID
  export const fetchGetAbonoById = async (id) => {
    try {
      const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/abono/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching abono with ID ${id}:`, error);
      throw error;
    }
  };

   // Agregar un abono por ID
  export const fetchPostAbono = async (abonoData) => {
    try {
      const response = await axios.post(`${config.typeRequest}://${config.apiUrl}/abono/`, abonoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear el abono: ${error.response ? error.response.data.message : error.message}`);
    }
  };

 // Actualizar un abono por ID
  export const fetchPutAbono = async (id, abonoData) => {
    try {
      const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/abono/${id}`, abonoData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar el abono: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    // Elimiar un abono por ID
  export const fetchDeleteAbono = async (id) => {
    try {
      const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/abono/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar el abono: ${error.response ? error.response.data.message : error.message}`);
    }
  };