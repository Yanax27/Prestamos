import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { useLocation } from "react-router-dom";
import { fetchGetAllPrestarios, fetchDeletePrestario } from "../http/fetchPrestario"; // Cambiar la ruta según tu estructura

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
        //console.log(datos)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prestarios:", error);
      }
    };
    fetchData();
  }, []);
  
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al Cliente ${nombre}?`)) {
      try {
        await fetchDeletePrestario(id);
        alert(`Se ha eliminado al Cliente ${nombre}`);
        // Vuelve a obtener la lista actualizada de prestarios
        const updatedDatos = await fetchGetAllPrestarios();
        setDatos(updatedDatos);
      } catch (error) {
        console.error("Error deleting prestario:", error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDatos = datos.filter((cliente) => {
    const fullName = `${cliente.nombre} ${cliente.apellido}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className=".">
      <section className="p-3">
        <p className="text-gray-500 dark:text-gray-400">
          {location.pathname}
        </p>  
        <div className="max-w-screen-xl px-4 mx-auto lg:px-12 w-full">
          <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">Buscar</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="simple-search"
                      className="block w-full p-2 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Buscar..."
                      required=""
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                <Link to={"/dashboard/agregar/cliente/newClient"}>
                  <button type="button" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                    <FaPlus className="h-3.5 w-3.5 mr-2 -ml-1" />
                    Añadir Cliente
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nombres</th>
                <th scope="col" className="px-6 py-3">Apellidos</th>
                <th scope="col" className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatos.map((cliente) => (
                <tr key={cliente.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <NavLink to={`/dashboard/detalle/cliente/${cliente.id_prestario}`} className="navlink-item">
                      {cliente.nombre}
                    </NavLink>
                  </th>
                  <td className="px-6 py-4">
                    <NavLink to={`/dashboard/detalle/cliente/${cliente.id_prestario}`} className="navlink-item">
                      {cliente.apellido}
                    </NavLink>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <button className="text-yellow-600 inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Edit Client">
                        <Link to={`/dashboard/agregar/cliente/${cliente.id_prestario}`} className="navlink-button">
                          <FaEdit className="h-4 w-4" />
                        </Link>
                      </button>
                      <button className="text-red-700 inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Delete Client" onClick={() => handleDelete(cliente.id_prestario, cliente.nombre)}>
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Clientes;
