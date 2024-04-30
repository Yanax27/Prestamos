import axios from "axios";
import config from "../config";

export const validTokenSession = async () => {
  const data = {
    validation: "Validation",
  };
  return axios.get(
    `${config.typeRequest}://${config.apiUrl}/usuario/validToken/`,
    data
  );
};
export const logoutSessionToken = async () => {
    return axios.get(
        `${config.typeRequest}://${config.apiUrl}/usuario/logout/`
    );
}
