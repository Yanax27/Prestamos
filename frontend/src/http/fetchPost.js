import axios from "axios";
import config from "../config";

export const createUsuario = async (body) => {
    return await axios.post(`${config.typeRequest}://${config.apiUrl}/usuario/`,body);
};

