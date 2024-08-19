import axios from "axios";
import config from "../config";

export const loginUser = async (body) => {
    //return await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/login`,body);
    try {
        return await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/login`, body);
    } catch (error) {
        if (error.response) {
            return error.response.data; // Devuelve el error del backend
        } else {
            return { error: true, message: error.message }; // Devuelve un error genérico
        }
    }

};

