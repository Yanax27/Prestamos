import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Paginas/Navbar";
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
    if (!auth && !validate) return <Navigate to={"/"}></Navigate>;
  };
  const validateSession = async () => {
    const response = await localStorage.getItem(config.localStorage);
    if (response) {
      // console.log(response);
      const dataConvert = JSON.parse(response);
      setDataAuth(dataConvert);
      setIsLoggedIn(true);
      setValidToken(true)
    }
  };
  useEffect(() => {
    validateSession();
  },[]);
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Routes>
          <Route
            path={"/"}
            element={
              <ValidateRedir
                auth={authUser.user}
                validate={validToken}
                redirecTo="/dashboard"
              >
                <Login></Login>
              </ValidateRedir>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute auth={isLoggedIn} validate={validToken}>
                <ResumenFinanciero />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
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
              path="/ingresosEgresos"
              element={
                <div className={!navVisible ? "page" : "page page-with-navbar"}>
                  <IngresoEgreso />
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
