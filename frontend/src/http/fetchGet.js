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