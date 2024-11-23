import { loginSuccess, logoutSuccess } from "../slices/authSlice";
import { fetchLogin, fetchLogout } from "../../http/fetchUsuario";

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await fetchLogin(credentials); // Llama a la función de login
    dispatch(
      loginSuccess({
        user: response.data.userLogin, // Datos del usuario del backend
        token: response.data.token, // Token retornado por el backend
      })
    );
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error; // Manejar error en el componente
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await fetchLogout(); // Llama a la función de logout
    dispatch(logoutSuccess());
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error; // Manejar error en el componente
  }
};
