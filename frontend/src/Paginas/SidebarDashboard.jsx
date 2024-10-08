import React, { useContext, useState } from "react";
import {
  FaAngleRight,
  FaAngleLeft,
  FaChartBar,
  FaThLarge,
  FaBars,
  FaUsers,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import Client from "../assets/Client.png";
import EgresosSidebar from "../assets/EgresosSidebar.png";
import IngresosSidebar from "../assets/IngresosSidebar.png";
import { DataContext } from "../context/Provider";


const ICON_SIZE = 20;

function Navbar() { 
  const { outhSession } = useContext(DataContext);
  const navigate = useNavigate(); // Obtén la función de navegación

  const handleOuthSession = async () => {
    await outhSession();
    //navigate("/"); // Navega a la página de inicio
  };
  return (
    <aside
      id="default-sidebar"
      className="block p-2 border shadow-lg border-r-200 top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <Link to={"/dashboard"}>
            <li>
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
          </Link>
          <Link to={"/dashboard/clientes"}>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={Client} alt="Clients" className="w-12" />
                <span className="flex-1 ms-3 whitespace-nowrap">Clientes</span>
                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Pro
                </span> */}
              </a>
            </li>
          </Link>
          <Link to={"/dashboard/ingresos"}>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={IngresosSidebar} alt="Egresos" className="w-12" />
                <span className="flex-1 ms-3 whitespace-nowrap">Ingresos</span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span> */}
              </a>
            </li>
          </Link>
          <Link to={"/dashboard/egresos"}>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={EgresosSidebar} alt="Egresos" className="w-12" />
                <span className="flex-1 ms-3 whitespace-nowrap">Egresos</span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span> */}
              </a>
            </li>
          </Link>
          <Link to={"/login"} >
            <li>
              <button
                onClick={handleOuthSession}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Cerrar sesion
                </span>
              </button>
            </li>
          </Link>
        </ul>
      </div>
    </aside>
  );
}

export default Navbar;
