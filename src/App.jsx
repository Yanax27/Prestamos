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

function App() {
  const {
    authUser,
    setDataAuth,
    setIsLoggedIn,
    isLoggedIn,
    validToken,
    setValidToken,
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
  const ValidateRedir = ({ auth, validate, redirecTo, children }) => {
    //RUTAS REDIRECT
    if (auth && validate) {
      return <Navigate to={redirecTo}></Navigate>;
    }
    if (!auth) return children;
  };

  const ProtectedRoute = ({ auth, validate, children }) => {
    if (auth && validate) {
      return children;
    }
    const response = localStorage.getItem(config.localStorage);
    if (!response) return <Navigate to={"/"}></Navigate>;
  };

  const isDashboardRoute = location.pathname === "/dashboard";
  return (
    <>
      {/* {isDashboardRoute ? <Navbar></Navbar> : null} */}
      <Routes>
        <Route
          path="/"
          element={
            <ValidateRedir
              auth={authUser.user}
              validate={validToken}
              redirecTo="/dashboard"
            >
              <Login />
            </ValidateRedir>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute auth={isLoggedIn} validate={validToken}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="ingresos" element={<TableIngresos />} />
          <Route path="egresos" element={<TableEgresos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="agregar/cliente/:clienteId" element={<AddDatos />} />
          <Route path="detalle/cliente/:clienteId" element={<DetalleCliente />}/>
          <Route path="detalle/cuenta/:cuentaId" element={<DetalleCuenta />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="cuentas" element={<Cuentas />} /> 
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;

{
}
{
  /* <Navbar
            visible={navVisible}
            show={showNavbar}
            hideNavbar={hideNavbar}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <ResumenFinanciero />
                </div>
              }
            /> 
            <Route
              path="/Clientes"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <Clientes />
                </div>
              }
            />
            <Route
              path="/AddDatos/:clienteId"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <AddDatos />
                </div>
              }
            />
            <Route
              path="/DetalleCliente/:clienteId"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <DetalleCliente />
                </div>
              }
            />
            <Route
              path="/Cuentas"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <Cuentas />
                </div>
              }
            />
            <Route
              path="/DetalleCuenta/:cuentaId"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <DetalleCuenta />
                </div>
              }
            />
            <Route
              path="/perfil"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <Perfil onCerrarSesion={handleLogout} />
                </div>
              }
            />
          </Routes> */
}
{
  /* </div> */
}
