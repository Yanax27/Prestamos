import { useContext, useState } from "react";
import { DataContext } from "../context/Provider";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const NavbarDashboard = ({ toggleSidebar, isSidebarOpen }) => {
  const [menuProfile, setMenuProfile] = useState(false);
  const { outhSession } = useContext(DataContext);

  const handleOuthSession = () => {
    swal({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      buttons: ["Cancelar", "Cerrar sesión"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        outhSession();
        window.location.href = "/login";
      }
    });
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 flex justify-between items-center h-16">
        
        {/* Botón para mostrar/ocultar sidebar en la izquierda */}
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none mr-auto">
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="h-6 w-6" />
        </button>

        {/* Espaciador central */}
        <div className="flex-1"></div>

        {/* Iconos de usuario y notificación a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Icono de Notificaciones */}
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
          </button>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setMenuProfile(!menuProfile)}
              className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
            </button>
            {menuProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Perfil
                </button>
                <button
                  onClick={handleOuthSession}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
