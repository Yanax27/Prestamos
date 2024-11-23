import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGetAllPrestarios, fetchDeletePrestario } from "../http/fetchPrestario";

const Clientes = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGetAllPrestarios();
        setDatos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prestarios:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, nombre) => {
    swal({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar al cliente ${nombre}?`,
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await fetchDeletePrestario(id);
          toast.success(`Cliente ${nombre} eliminado exitosamente`);
          const updatedDatos = await fetchGetAllPrestarios();
          setDatos(updatedDatos);
        } catch (error) {
          toast.error("Error al eliminar el cliente");
          console.error("Error deleting prestario:", error);
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDatos = datos.filter((cliente) => {
    const fullName = `${cliente.nombre} ${cliente.apellido}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="grid w-full">
      <ToastContainer />
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              {/* Búsqueda */}
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Buscar
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="simple-search"
                      className="block w-full p-2 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </form>
              </div>

              {/* Botones Agregar y Filtrar */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <Link to={"/dashboard/agregar/cliente/newClient"}>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-secondary dark:bg-primary dark:hover:bg-primary focus:outline-none dark:focus:ring-secondary"
                  >
                    <FaPlus className="h-3.5 w-3.5 mr-2 -ml-1" />
                    Añadir Cliente
                  </button>
                </Link>

                {/* Botón de Filtro */}
                <button
                  id="filterDropdownButton"
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-4 w-4 mr-2 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filtrar
                  <svg
                    className="-mr-1 ml-1.5 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Tabla */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nombres</th>
                      <th scope="col" className="px-6 py-3">Apellidos</th>
                      <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDatos.map((cliente) => (
                      <tr key={cliente.id_prestario} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          <NavLink to={`/dashboard/detalle/cliente/${cliente.id_prestario}`}>
                            {cliente.nombre}
                          </NavLink>
                        </td>
                        <td className="px-6 py-4">
                          <NavLink to={`/dashboard/detalle/cliente/${cliente.id_prestario}`}>
                            {cliente.apellido}
                          </NavLink>
                        </td>
                        <td className="px-6 py-4 flex space-x-2">
                          <Link to={`/dashboard/agregar/cliente/${cliente.id_prestario}`}>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <FaEdit />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(cliente.id_prestario, cliente.nombre)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Clientes;
