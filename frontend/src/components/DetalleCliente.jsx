import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUser, FaMoneyBillAlt, FaArrowLeft } from "react-icons/fa";
import { Spinner } from "./Spinner";
import Cuentas from "./Cuentas";
import { fetchGetPrestarioById } from "../http/fetchPrestario";

const DetalleCliente = () => {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  
  const [clienteData, setClienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarCliente, setMostrarCliente] = useState(true);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const cliente = await fetchGetPrestarioById(clienteId);
        setClienteData(cliente);
      } catch (error) {
        console.error("Error al obtener datos del cliente: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [clienteId]);

  if (loading) {
    return <Spinner />;
  }

  const handleToggleMostrarCliente = () => {
    setMostrarCliente(!mostrarCliente);
  };

  return (
    <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
      <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <Link to="/dashboard/clientes">
          <li className="flex flex-col items-center justify-around hover:text-primary">
            <FaArrowLeft size={20} />
            <span>Volver</span>
          </li>
        </Link>
        <li className="flex flex-col items-center justify-between hover:text-primary" onClick={() => setMostrarCliente(true)}>
          <FaUser size={20} />
          <span>Cliente</span>
        </li>
        <li className="flex flex-col items-center justify-around hover:text-primary" onClick={() => setMostrarCliente(false)}>
          <FaMoneyBillAlt size={20} />
          <span>Cuenta</span>
        </li>
      </ul>
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src="https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg"
          alt="Perfil del cliente"
        />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold">
          {clienteData.nombre} {clienteData.apellido}
        </h2>
        <div className="p-4 border-t mx-8 mt-2"></div>
        {mostrarCliente ? (
          <>
            <p className="text-gray-500">Negocio: {clienteData.negocio}</p>
            <p className="text-gray-500">CI: {clienteData.ci}</p>
            <p className="text-gray-500">Dirección: {clienteData.direccion}</p>
            <p className="text-gray-500">Teléfono: {clienteData.telefono}</p>
            <p className="text-gray-500">Estado: {clienteData.estado}</p>
          </>
        ) : (
          <Cuentas idPrestario={clienteData.id_prestario} />
        )}
      </div>
      <div className="p-4 border-t mx-8 mt-1"></div>
    </div>
  );
};

export default DetalleCliente;
