import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "./redux-toolkit/actions/authAction";
import { fetchValidateToken } from "./http/fetchUsuario";
import "./App.css";
import Navbar from "./Paginas/SidebarDashboard";
import Clientes from "./components/Clientes";
import AddDatos from "./components/AddDatos";
import DetalleCliente from "./components/DetalleCliente";
import Cuentas from "./components/Cuentas";
import ResumenFinanciero from "./Paginas/ResumenFinanciero";
import DetalleCuenta from "./components/DetalleCuenta";
import Login from "./Paginas/Login";
import Perfil from "./Paginas/Perfil";
import { Dashboard } from "./layouts/Dashboard";
import { TableIngresos } from "./components/TableIngresos";
import { TableEgresos } from "./components/TableEgresos";
import NotFound from "./Paginas/NotFound";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./utils/protectedRoute";

function App() {
  const { isAuthenticated, token } = useSelector((state) => state.auth); // Obtener token de Redux
  const dispatch = useDispatch();
  const [tokenValidated, setTokenValidated] = useState(false);

  // Validar token al cargar la aplicación
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          console.warn("No hay token presente, el usuario no está autenticado");
          dispatch(logoutUser());
          setTokenValidated(true);
          return;
        }

        const response = await fetchValidateToken(); // Valida el token con el backend
        if (response.success) {
          dispatch(
            loginUser({
              user: response.user,
              token,
            })
          );
        } else {
          console.warn("El token presente no es válido");
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error("Error al validar token:", error.message || error);
        dispatch(logoutUser());
      } finally {
        setTokenValidated(true);
      }
    };

    validateToken();
  }, [dispatch, token]);

  if (!tokenValidated) {
    return <div>Cargando...</div>; // Muestra un spinner o mensaje de carga mientras valida el token
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="ingresos" element={<TableIngresos />} />
          <Route path="egresos" element={<TableEgresos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="agregar/cliente/:clienteId" element={<AddDatos />} />
          <Route path="detalle/cliente/:clienteId" element={<DetalleCliente />} />
          <Route path="detalle/cuenta/:cuentaId" element={<DetalleCuenta />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="cuentas" element={<Cuentas />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
