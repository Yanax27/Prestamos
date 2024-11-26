import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Inicialmente sin usuario
  token: null, // Almacenar el token en Redux
  isAuthenticated: false, // Determinar autenticación con base en el estado
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
