import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import financieroReducer from "../slices/financieroSlice"; // Importar el slice financiero

const store = configureStore({
  reducer: {
    auth: authReducer, // Reducer para autenticación
    financiero: financieroReducer, // Reducer para datos financieros
  },
});

export default store;
