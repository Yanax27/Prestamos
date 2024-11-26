import axios from "axios";
import config from "../config";

// Iniciar sesión
export const loginUser = async (body) => {
    try {
        return await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/login`, body);
    } catch (error) {
        if (error.response) {
            return error.response.data; // Devuelve los datos del error del backend
        } else {
            return { error: true, message: error.message }; // Devuelve un error general
        }
    }
};

// Cerrar sesión
export const logoutUser = async () => {
    try {
        return await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/logout`);
    } catch (error) {
        if (error.response) {
            return error.response.data; // Devuelve los datos del error del backend
        } else {
            return { error: true, message: error.message }; // Devuelve un error general
        }
    }
};
