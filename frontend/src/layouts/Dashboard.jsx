import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarDashboard from "../Paginas/SidebarDashboard";
import NavbarDashboard from "../Paginas/NavbarDashboard";
import ResumenFinanciero from "../Paginas/ResumenFinanciero";

export const Dashboard = () => {
  const location = useLocation();
  
  // Almacenar el estado del sidebar en localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  // Función para alternar el estado del sidebar y guardar en localStorage
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    // Cada vez que cambies de ruta, el estado del sidebar se mantiene sin resetear
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen, location]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarDashboard isSidebarOpen={isSidebarOpen} />

      {/* Contenido principal */}
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Navbar superior */}
        <NavbarDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Contenido de página */}
        <div className="flex-1 overflow-y-auto p-4">
          {location.pathname === "/dashboard" ? <ResumenFinanciero /> : <Outlet />}
        </div>

        {/* Footer
        <footer className="p-4 bg-white text-center text-xs text-gray-500 absolute bottom-0 w-full">
          Copyright &copy; 2024
        </footer> */}
      </div>
    </div>
  );
};

export default Dashboard;
