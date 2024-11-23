import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usuarios: [],
  cuenta: null,
  loading: false,
  error: null,
};

const financieroSlice = createSlice({
  name: "financiero",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUsuarios(state, action) {
      state.usuarios = action.payload;
      state.loading = false;
    },
    setCuenta(state, action) {
      state.cuenta = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { startLoading, setUsuarios, setCuenta, setError } = financieroSlice.actions;
export default financieroSlice.reducer;
