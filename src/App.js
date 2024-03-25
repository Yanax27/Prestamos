import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <div>
      {isLoggedIn ? (
        <BrowserRouter>
          <div className="App">
            <Navbar
              visible={navVisible}
              show={showNavbar}
              hideNavbar={hideNavbar}
            />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <ResumenFinanciero />
                  </div>
                }
              />
              <Route
                path="/ingresosEgresos"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <IngresoEgreso />
                  </div>
                }
              />
              <Route
                path="/Clientes"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <Clientes />
                  </div>
                }
              />
              <Route
                path="/AddDatos/:clienteId"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <AddDatos />
                  </div>
                }
              />
              <Route
                path="/DetalleCliente/:clienteId"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <DetalleCliente />
                  </div>
                }
              />
              <Route
                path="/Cuentas"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <Cuentas />
                  </div>
                }
              />
              <Route
                path="/DetalleCuenta/:cuentaId"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <DetalleCuenta />
                  </div>
                }
              />
			   <Route
                path="/perfil"
                element={
                  <div
                    className={!navVisible ? "page" : "page page-with-navbar"}
                  >
                    <Perfil onCerrarSesion={handleLogout} />
                  </div>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      ) : (
        <div className="login-container">
          <Login handleLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
