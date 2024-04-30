import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./Paginas/SidebarDashboard";
import Clientes from "./components/Clientes";
import AddDatos from "./components/AddDatos";
import DetalleCliente from "./components/DetalleCliente";
import Cuentas from "./components/Cuentas";
import ResumenFinanciero from "./Paginas/ResumenFinanciero";
import DetalleCuenta from "./components/DetalleCuenta";
import Login from "./Paginas/Login";
import "./App.css";
import Perfil from "./Paginas/Perfil";
import IngresoEgreso from "./Paginas/IngresoEgreso";
import { Toaster } from "react-hot-toast";
import { DataContext } from "./context/Provider";
import config from "./config";
import { Dashboard } from "./layouts/Dashboard";
import { TableIngresos } from "./components/TableIngresos";
import { TableEgresos } from "./components/TableEgresos";
import NotFound from "./Paginas/NotFound";
import { validTokenSession } from "./http/fetchGet";
import { set } from "react-hook-form";

function App() {
  const {
    authUser,
    setDataAuth,
    setIsLoggedIn,
    isLoggedIn,
    validToken,
    setValidToken,
    evaluateAuth,
  } = useContext(DataContext);
  const location = useLocation();
  //const [navVisible, setNavVisible] = useState(false); // Agrega estado para controlar la visibilidad del navbar
  const [navVisible, showNavbar] = useState(false);
  const hideNavbar = () => {
    showNavbar(false);
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  const ValidateRedir = ({ redirecTo, children }) => {
    if (authUser.user && validToken) {
      return <Navigate to={redirecTo}></Navigate>;
    }
    if (!authUser.user) return children;
  };

  const ProtectedRouteRoles = ({ children }) => {
    if (authUser.user && authUser.user.rol == "Administrador") {
      return children;
    }
    return <Navigate to={"/login"}></Navigate>;
  };
  const validSessionToken = async () => {
    const response = await validTokenSession();
    if(response.data.data.userData){
      setDataAuth({
        ...authUser,
        user: response.data.data.userData,
      });
      setIsLoggedIn(true);
      setValidToken(true);
    }
    
  };
  const isDashboardRoute = location.pathname === "/dashboard";
  useEffect(() => {
    // validSessionToken();
  }, []);
  return (
    <>
      {/* {isDashboardRoute ? <Navbar></Navbar> : null} */}
      <Routes>
        <Route
          path="/login"
          element={
            <ValidateRedir redirecTo="/">
              <Login />
            </ValidateRedir>
          }
        ></Route>

        <Route
          path="/"
          element={
            <ProtectedRouteRoles>
              <Dashboard />
            </ProtectedRouteRoles>
          }
        >
          <Route path="ingresos" element={<TableIngresos />} />
          <Route path="egresos" element={<TableEgresos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="agregar/cliente/:clienteId" element={<AddDatos />} />
          <Route
            path="detalle/cliente/:clienteId"
            element={<DetalleCliente />}
          />
          <Route path="detalle/cuenta/:cuentaId" element={<DetalleCuenta />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="cuentas" element={<Cuentas />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster></Toaster>
    </>
  );
}

export default App;
