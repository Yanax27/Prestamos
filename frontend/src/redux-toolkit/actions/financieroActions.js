import { startLoading, setUsuarios, setCuenta, setError } from "../slices/financieroSlice";
import { fetchGetAllUsuarios} from "../../http/fetchUsuario";
import { fetchGetCuentaById } from "../../http/fetchCuenta";

export const fetchAllUsuarios = (email) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const usuarios = await fetchGetAllUsuarios(email);
    dispatch(setUsuarios(usuarios));
  } catch (error) {
    dispatch(setError("Error al obtener los usuarios."));
  }
};

export const fetchCuentaById = (cuentaId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const cuenta = await fetchGetCuentaById(cuentaId);
    dispatch(setCuenta(cuenta));
  } catch (error) {
    dispatch(setError("Error al obtener los datos de la cuenta."));
  }
};
