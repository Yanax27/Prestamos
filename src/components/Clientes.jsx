import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../data/FIreBase";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const Clientes = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "PrestamoDBA"));
      const sel = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setDatos(data);
        setLoading(false);
      });
      return sel;
    };
    fetchData();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de desea eliminar al Cliente ${nombre}?`)) {
      await deleteDoc(doc(db, "PrestamoDBA", id));
      alert(`Se ha eliminado al Cliente ${nombre}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDatos = datos.filter((cliente) => {
    const fullName = `${cliente.Nombres} ${cliente.Apellidos}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  //  <input type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required="" value={searchTerm} onChange={handleSearch} />
  return (
    <main className=".">

      <section class="p-3">
        <div class="max-w-screen-xl px-4 mx-auto lg:px-12 w-full">
          <div class="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <div class="w-full md:w-1/2">
                <form class="flex items-center">
                  <label for="simple-search" class="sr-only">Search</label>
                  <div class="relative w-full">
                    <input type="text" id="simple-search" class="block w-full p-2 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Buscar..." required="" value={searchTerm} onChange={handleSearch} />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>
              <div class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                <Link to={"/dashboard/agregar/cliente/newClient"}>
                  <button type="button" class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
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

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Nombres
                </th>
                <th scope="col" class="px-6 py-3">
                  Apellidos
                </th>
                <th scope="col" class="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDatos.map((cliente) => (
                <tr key={cliente.id} class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <NavLink to={`/dashboard/detalle/cliente/${cliente.id}`} className="navlink-item">
                      {cliente.Nombres}
                    </NavLink>
                  </th>
                  <td class="px-6 py-4">
                    <NavLink to={`/dashboard/detalle/cliente/${cliente.id}`} className="navlink-item">
                      {cliente.Apellidos}
                    </NavLink>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <button class="text-yellow-600 inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Edit Product">
                      <Link to={`/dashboard/agregar/cliente/${cliente.id}`} className="navlink-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"  viewBox="0 0 24 24"  stroke-width="1.5"  stroke="currentColor" class="h-4 w-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        </Link>
                      </button>
                      <button class=" text-red-700 inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Delete Product" onClick={() => handleDelete(cliente.id, cliente.Nombres)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
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


/*
 <td class="px-6 py-4">
                    <button className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                      <NavLink to={`/dashboard/agregar/cliente/${cliente.id}`} className="navlink-button">
                        <FaEdit />
                      </NavLink>
                    </button>
                    <button className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 transition-all duration-300 ease-in-out transform hover:rounded-full"
                      onClick={() => handleDelete(cliente.id, cliente.Nombres)}>
                      <FaTrash />
                    </button>

                  </td>
*/

/*
 <section className=" p-4">
        <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
            <form class="flex items-center">
            <label for="simple-search" class="sr-only">Buscar...</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
             <input type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Buscar..." required="" value={searchTerm} onChange={handleSearch} />
            </div>
          </form>
            </div>
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              <Link to={"/dashboard/añadir/datos/newClient"}>
                <button type="button"
                  class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor"
                    aria-hidden="true">
                    <path
                      d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Añadir Cliente
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>
*/



/*
 <main className="table" id="customers_table">
      <section className="table__header">
        <h1>Clientes</h1>
        <button className="add">
          <NavLink to={"/AddDatos/newClient"} className="navlink-button">
            <FaPlus /> Nuevo Cliente
          </NavLink>
        </button>

        <div className="input-group">
          <input type="search" placeholder="Buscar..."  
            value={searchTerm}
            onChange={handleSearch}/>
          <FaSearch className="search-icon" />
        </div>
      </section>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <section className="table__body">
          <table>
            <thead>
              <tr>
                <th> CI </th>
                <th> Nombres </th>
                <th> Apellidos </th>
                <th> Acciones </th>
              </tr>
            </thead>
            <tbody>
            {filteredDatos.map((cliente) => (
                  <NavLink  to={"/DetalleCliente/" + cliente.id}>
                  <tr key={cliente.id}>
                  <td>{cliente.CI}</td>
                  <td>{cliente.Nombres}</td>
                  <td>{cliente.Apellidos}</td>
                  <td>
                    <button className="edit">
                      <NavLink to={"/AddDatos/" + cliente.id} className="navlink-button">
                        <FaEdit />
                      </NavLink>
                    </button>
                    <button
                      className="delete"
                      onClick={() => Delete(cliente.id, cliente.Nombres)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                  </NavLink>
                  
              ))}
             
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};



<main className="table" id="customers_table">
      <section className="table__header">
        <h1>Clientes</h1>
        <button className="add">
          <NavLink to={"/AddDatos/newClient"} className="navlink-button">
            <FaPlus /> Nuevo Cliente
          </NavLink>
        </button>

        <div className="input-group">
          <input
            type="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
      </section>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <section className="table__body">
          <table>
            <thead>
              <tr>
                <th> CI </th>
                <th> Nombres </th>
                <th> Apellidos </th>
                <th> Acciones </th>
              </tr>
            </thead>
            <tbody>
              {filteredDatos.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.CI}</td>
                  <td>
                    <NavLink to={"/DetalleCliente/" + cliente.id} className="navlink-item">
                      {cliente.Nombres}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink to={"/DetalleCliente/" + cliente.id}>
                      {cliente.Apellidos}
                    </NavLink>
                  </td>
                  <td>
                    <button className="edit">
                      <NavLink
                        to={"/AddDatos/" + cliente.id}
                        className="navlink-button"
                      >
                        <FaEdit />
                      </NavLink>
                    </button>
                    <button
                      className="delete"
                      onClick={() => Delete(cliente.id, cliente.Nombres)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};

*/




/*
 {datos.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.CI}</td>
                  <td>{cliente.Nombres}</td>
                  <td>{cliente.Apellidos}</td>
                  <td>
                    <button
                      className="edit">
                      <NavLink to={"/AddDatos/"+cliente.id} className="navlink-button">
                      <FaEdit />
                      </NavLink>
                      
                    </button>
                    <button
                      className="delete"
                      onClick={() => Delete(cliente.id, cliente.Nombres)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              */