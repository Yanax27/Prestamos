import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaUser, FaMoneyBillAlt, FaArrowLeft } from "react-icons/fa";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../data/FIreBase";
import "../styles/DetalleCliente.css";
import { Spinner } from "./Spinner";
import Cuentas from "./Cuentas";

const DetalleCliente = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(-1); // Navega hacia atrás en el historial del navegador
  };
  const { clienteId } = useParams();
  const [clienteData, setClienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarCliente, setMostrarCliente] = useState(true);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const clienteDoc = await getDoc(doc(db, "PrestamoDBA", clienteId));
        if (clienteDoc.exists()) {
          setClienteData(clienteDoc.data());
        } else {
          console.error("Cliente no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener datos del cliente: ", error);
      }
    };

    fetchClienteData();
  }, [clienteId]);

  if (!clienteData) {
    // Si clienteData es null, aún estamos cargando los datos del cliente
    return <Spinner />;
  }

  const handleToggleMostrarCliente = () => {
    setMostrarCliente(!mostrarCliente);
  };

  return (
    <div className="contenedor">
      <div className="botones">
        <button className="boton" onClick={handleVolver}>
          <FaArrowLeft size={20} />
          <span>Volver</span>
        </button>
        <button
          className={`boton ${mostrarCliente ? "activo" : ""}`}
          onClick={() => setMostrarCliente(true)}
        >
          <FaUser size={20} />
          <span>Cliente</span>
        </button>
        <button
          className={`boton ${!mostrarCliente ? "activo" : ""}`}
          onClick={() => setMostrarCliente(false)}
        >
          <FaMoneyBillAlt size={20} />
          <span>Cuenta</span>
        </button>
      </div>

      <div className="info-cliente">
        <div className="profile-icon">
          <FaUser size={60} />
        </div>
        {mostrarCliente ? (
          <>
            <h1>
              {clienteData.Nombres} {clienteData.Apellidos}
            </h1>
            <p>CI: {clienteData.CI}</p>
            <p>Dirección: {clienteData.Direccion}</p>
            <p>Teléfono: {clienteData.Telefono}</p>
            <p>Negocio: {clienteData.Negocio}</p>
            <p>Estado: {clienteData.Estado}</p>
          </>
        ) : (
          <Cuentas clienteId={clienteId} />
        )}
      </div>
    </div>
  );
};

export default DetalleCliente;
