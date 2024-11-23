import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faThLarge,
  faUserFriends,
  faDollarSign,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { logoutUser } from "../redux-toolkit/actions/authAction";

const NavBar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Extraer el usuario desde Redux

  // Manejar cierre de sesión
  const handleLogout = () => {
    swal({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      buttons: ["Cancelar", "Cerrar sesión"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        dispatch(logoutUser()); // Despachar acción de cierre de sesión
        navigate("/login"); // Redirigir al login
      }
    });
  };

  // Verificar si un usuario tiene un rol específico
  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 shadow-lg z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-semibold">PRESTAME</h2>
      </div>

      {/* Sidebar Body */}
      <div className="flex flex-col justify-between h-full p-4">
        <ul className="space-y-4">
          <Link to="/dashboard">
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
              <FontAwesomeIcon
                icon={faThLarge}
                className="text-gray-100 w-5 h-5 transition duration-75 group-hover:text-gray-900"
              />
              <span className="ml-3">Inicio</span>
            </li>
          </Link>

          {/* Mostrar Clientes solo para usuarios con rol "admin" */}
          {(hasRole("admin") || hasRole("prestamista"))&& (
            <Link to="/dashboard/clientes">
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
                <FontAwesomeIcon
                  icon={faUserFriends}
                  className="text-gray-100 w-5 h-5 transition duration-75 group-hover:text-gray-900"
                />
                <span className="ml-3">Clientes</span>
              </li>
            </Link>
          )}

          {/* Mostrar Ingresos solo para usuarios con rol "prestamista" o "admin" */}
          {hasRole("admin") && (
            <Link to="/dashboard/ingresos">
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-gray-100 w-5 h-5 transition duration-75 group-hover:text-gray-900"
                />
                <span className="ml-3">Ingresos</span>
              </li>
            </Link>
          )}

          {/* Mostrar Egresos solo para usuarios con rol "admin" */}
          {hasRole("admin") && (
            <Link to="/dashboard/egresos">
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="text-gray-100 w-5 h-5 transition duration-75 group-hover:text-gray-900"
                />
                <span className="ml-3">Egresos</span>
              </li>
            </Link>
          )}
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center p-2 mt-4 text-gray-100 rounded-lg hover:bg-red-600 hover:text-white group"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="w-5 h-5 transition duration-75"
          />
          <span className="ml-3">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default NavBar;
