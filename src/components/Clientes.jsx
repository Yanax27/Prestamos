import React from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../data/FIreBase";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../styles/Clientes.css";
import { Link, NavLink } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const Clientes = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "PrestamoDBA"));
    const sel = onSnapshot(q, (QuerySnapshot) => {
      let todosArray = [];
      QuerySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      console.log(todosArray);
      setDatos(todosArray);
      setLoading(false);
    });
    return () => sel();
  }, []);

 

  const Delete = async (id, nombre) => {
    if (window.confirm("¿Estás seguro de desea eliminar al Cliente "+nombre+"?")) {
      await deleteDoc(doc(db, "PrestamoDBA", id));
      alert("Se ha eliminado al Cliente "+nombre);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDatos = datos.filter((cliente) => {
    const fullName = `${cliente.Nombres} ${cliente.Apellidos}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className="table" id="customers_table">
    <section className="table__header">
      <h1>Clientes</h1>
      <button className="add">
        <NavLink to={"/AddDatos/newClient"} className="navlink-button">
          <FaPlus /> Nuevo Cliente
        </NavLink>
      </button>

      
    </section>
    <section className="table__header">
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
              <th> Nombres </th>
              <th> Apellidos </th>
              <th> Acciones </th>
            </tr>
          </thead>
          <tbody>
            {filteredDatos.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <NavLink to={"/DetalleCliente/" + cliente.id} className="navlink-item">
                    {cliente.Nombres}
                  </NavLink>
                </td>
                <td>
                  <NavLink to={"/DetalleCliente/" + cliente.id} className="navlink-item">
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

export default Clientes;
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