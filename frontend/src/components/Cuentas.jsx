import React, { useState, useEffect } from "react";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "../styles/Cuentas.css";
import { fetchGetAllPrestamos, fetchDeletePrestamo, fetchPostPrestamo } from "../http/fetchPrestamo";

const Cuentas = ({ idPrestario }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nrocuotas, setNrocuotas] = useState(24);
  const [fechaInicial, setFechaInicial] = useState(new Date().toISOString());
  const [tipoCuota, setTipoCuota] = useState("Diario");
  const [interes, setInteres] = useState(20);
  const [monto, setMonto] = useState(0);

  useEffect(() => {
    if (idPrestario) {
      fetchGetAllPrestamos(idPrestario)
        .then((data) => setPrestamos(data))
        .catch((error) => console.error("Error fetching prestamos:", error));
    }
  }, [idPrestario, prestamos]);

  useEffect(() => {
    if (tipoCuota === "Diario") {
      setNrocuotas(24);
    } else if (tipoCuota === "Semanal") {
      setNrocuotas(4);
    }
  }, [tipoCuota]);

  const calcularFechasPago = () => {
    let fechas = [];
    let verificarPago = Array(nrocuotas).fill("pendiente");
    let fechaActual = new Date(fechaInicial);
  
    for (let i = 0; i < nrocuotas; i++) {
      // Si es domingo (0), incrementa la fecha al lunes
      if (fechaActual.getDay() === 6) {
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
  
      fechas.push(fechaActual.toISOString());
  
      // Incrementa la fecha según el tipo de cuota
      fechaActual.setDate(
        fechaActual.getDate() + (tipoCuota === "Diario" ? 1 : 7)
      );
    }
  
    return { fechas, verificarPago };
  };
  

  const handleGuardar = async () => {
    try {
      const { fechas, verificarPago } = calcularFechasPago();

      const nuevoPrestamoData = {
        numeroCuota: nrocuotas,
        fechaInicial: new Date(fechaInicial).toISOString(),
        interes: interes,
        tipoCuota: tipoCuota,
        monto: parseFloat(monto),
        valorCuota: (parseFloat(monto) + (parseFloat(interes) * parseFloat(monto)) / 100) / nrocuotas,
        deudaActual: parseFloat(monto) + (parseFloat(interes) * parseFloat(monto)) / 100,
        PrestarioIdPrestario: idPrestario,
        UsuarioIdUsuario: "0f48179d-9904-46a3-aa4f-7f5095e04fb1",
        verificarPago,
        fechas,
      };
      await fetchPostPrestamo(nuevoPrestamoData);
      toast.success("Préstamo agregado con éxito");
      setMostrarFormulario(false);
    } catch (error) {
      toast.error("Error al añadir el préstamo");
      console.error("Error al añadir el préstamo: ", error);
    }
  };

  const handleDelete = async (idPrestamo) => {
    try {
      await fetchDeletePrestamo(idPrestamo);
      setPrestamos(prestamos.filter((cuenta) => cuenta.id_prestamo !== idPrestamo));
      toast.success("Préstamo eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el préstamo");
      console.error("Error al eliminar el préstamo: ", error);
    }
  };

  const confirmDelete = (idPrestamo) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el préstamo de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(idPrestamo);
      }
    });
  };

  return (
    <div className="table-content">
      <ToastContainer />
      <div className="w-full max-w-screen-xl px-4 mx-auto lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h2 className="mr-3 font-semibold dark:text-white">Cuentas</h2>
            </div>
            <button
              type="button"
              onClick={() => setMostrarFormulario(true)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800"
            >
              <FaPlus className="mr-2" />
              Agregar Cuenta
            </button>
          </div>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Insertar Préstamo</h2>

            <label>Fecha Inicial:</label>
            <DatePicker
              selected={new Date(fechaInicial)}
              onChange={(date) => setFechaInicial(date.toISOString())}
            />

            <label>Interés:</label>
            <input type="text" value={interes} onChange={(e) => setInteres(e.target.value)} />

            <label>Tipo Cuota:</label>
            <select value={tipoCuota} onChange={(e) => setTipoCuota(e.target.value)}>
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
            </select>

            <label>NroCuotas:</label>
            <input type="text" value={nrocuotas} onChange={(e) => setNrocuotas(e.target.value)} />

            <label>Monto:</label>
            <input type="text" value={monto} onChange={(e) => setMonto(e.target.value)} />

            <div className="modal-buttons">
              <button className="modal-button save-button" onClick={handleGuardar}>
                <FaCheck />
                Guardar
              </button>
              <button className="modal-button cancel-button" onClick={() => setMostrarFormulario(false)}>
                <FaTimes />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {!mostrarFormulario && prestamos.length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Monto</th>
                <th scope="col" className="px-6 py-3">Tipo Cuota</th>
                <th scope="col" className="px-6 py-3 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((cuenta) => (
                <tr key={cuenta.id_prestamo} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                    Bs. {cuenta.monto}
                  </th>
                  <td className="px-6 py-4">{cuenta.tipoCuota}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => confirmDelete(cuenta.id_prestamo)} className="text-red-600">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cuentas;
