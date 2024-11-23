import axios from "axios";
import config from "../config";

//PRESTATARIOS or CLIENTES
// Obtener todos los prestamos
export const fetchGetAllPrestamos = async (idPrestario) => {
  try {
    const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/prestamo?idPrestario=${idPrestario}`,
      {
        withCredentials: true, // Enviar cookies al servidor
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching prestamos:", error);
    throw error;
  }
};

// Obtener un prestamo por ID
export const fetchGetPrestamoById = async (id) => {
  try {
    const response = await axios.get(`${config.typeRequest}://${config.apiUrl}/prestamo/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching prestamo with ID ${id}:`, error);
    throw error;
  }
};

// Agregar un prestamo 
export const fetchPostPrestamo = async (prestamoData) => {
  try {
    const response = await axios.patch(`${config.typeRequest}://${config.apiUrl}/prestamo/`, prestamoData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear el prestamo: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Actualizar un prestamo por ID
export const fetchPutPrestamo = async (id, prestamoData) => {
  try {
    const response = await axios.put(`${config.typeRequest}://${config.apiUrl}/prestamo/${id}`, prestamoData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar el prestamo: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Elimiar un prestamo por ID
export const fetchDeletePrestamo = async (id) => {
  try {
    const response = await axios.delete(`${config.typeRequest}://${config.apiUrl}/prestamo/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el prestamo: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Cambiar el estado de múltiples cuotas de manera masiva
export const fetchActualizarEstadosCuotasMasivo = async (id, cuotas, nuevoEstado) => {
  try {
    const response = await axios.put(
      `${config.typeRequest}://${config.apiUrl}/prestamo/${id}/cambiar-estados-cuotas`,{ cuotas, nuevoEstado });
    return response.data;
  } catch (error) {
    throw new Error(
      `Error al actualizar estados de cuotas: ${error.response ? error.response.data.message : error.message}`
    );
  }
};