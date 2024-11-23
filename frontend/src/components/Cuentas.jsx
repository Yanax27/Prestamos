import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import "../styles/Cuentas.css";
import { fetchGetAllPrestamos, fetchDeletePrestamo, fetchPostPrestamo } from "../http/fetchPrestamo";

const Cuentas = ({ idPrestario }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [nrocuotas, setNrocuotas] = useState(24);
  const [tipoCuota, setTipoCuota] = useState("Diario");
  const [interes, setInteres] = useState(20);
  const navigate = useNavigate();

  const cargarPrestamos = () => {
    if (idPrestario) {
      fetchGetAllPrestamos(idPrestario)
        .then((data) => setPrestamos(data))
        .catch((error) => console.error("Error fetching prestamos:", error));
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, [idPrestario]);

  const calcularFechasPago = (fechaInicial, numcuota) => {
    let fechas = [];
    let verificarPago = Array(Number(numcuota)).fill("pendiente");
    let fechaActual = new Date(fechaInicial);

    for (let i = 0; i < numcuota; i++) {
      if (tipoCuota === "Diario") {
        fechaActual.setDate(fechaActual.getDate() + 1);
      } else if (tipoCuota === "Semanal") {
        fechaActual.setDate(fechaActual.getDate() + 7);
      }
      fechas.push(fechaActual.toISOString());
    }

    return { fechas, verificarPago };
  };

  const showAddPrestamoModal = () => {
    swal({
      title: "Insertar Préstamo",
      content: {
        element: "div",
        attributes: {
          innerHTML: `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label>Fecha Inicial:</label>
              <input type="date" id="fechaInicial" style="padding: 5px; font-size: 16px;" />
              
              <label>Interés (%):</label>
              <input type="number" id="interes" value="${interes}" style="padding: 5px; font-size: 16px;" />
              
              <label>Tipo Cuota:</label>
              <select id="tipoCuota" style="padding: 5px; font-size: 16px;">
                <option value="Diario" ${tipoCuota === "Diario" ? "selected" : ""}>Diario</option>
                <option value="Semanal" ${tipoCuota === "Semanal" ? "selected" : ""}>Semanal</option>
              </select>

              <label>Número de Cuotas:</label>
              <input type="number" id="nrocuotas" value="${nrocuotas}" style="padding: 5px; font-size: 16px;" />
              
              <label>Monto:</label>
              <input type="number" id="monto" style="padding: 5px; font-size: 16px;" />
            </div>
          `,
        },
      },
      buttons: ["Cancelar", "Guardar"],
    }).then(async (confirm) => {
      if (confirm) {
        const fechaInicial = document.getElementById("fechaInicial").value;
        const interes = document.getElementById("interes").value;
        const monto = document.getElementById("monto").value;
        const tipoCuotaSelect = document.getElementById("tipoCuota").value;
        const nrocuotasInput = document.getElementById("nrocuotas").value;

        if (!fechaInicial || !interes || !monto) {
          swal("Error", "Por favor, completa todos los campos", "error");
          return;
        }

        handleGuardar(fechaInicial, interes, monto, tipoCuotaSelect, nrocuotasInput);
      }
    });

    // Actualizar `nroCuotas` dinámicamente cuando `tipoCuota` cambia
    document.getElementById("tipoCuota").addEventListener("change", (e) => {
      const newTipoCuota = e.target.value;
      setTipoCuota(newTipoCuota);
      const updatedNrocuotas = newTipoCuota === "Diario" ? 24 : 4;
      setNrocuotas(updatedNrocuotas);
      document.getElementById("nrocuotas").value = updatedNrocuotas;
    });
  };

  const handleGuardar = async (fechaInicial, interes, monto, tipoCuotaSelect, nrocuotasInput) => {
    try {
      const { fechas, verificarPago } = calcularFechasPago(fechaInicial, nrocuotasInput);
      const nuevoPrestamoData = {
        numeroCuota: Number(nrocuotasInput),
        fechaInicial,
        interes,
        tipoCuota: tipoCuotaSelect,
        monto: parseFloat(monto),
        valorCuota: (parseFloat(monto) + (parseFloat(interes) * parseFloat(monto)) / 100) / Number(nrocuotasInput),
        deudaActual: parseFloat(monto) + (parseFloat(interes) * parseFloat(monto)) / 100,
        PrestarioIdPrestario: idPrestario,
        UsuarioIdUsuario: "1f48179d-9904-46a3-aa4f-7f5095e04fb2",
        verificarPago,
        fechas,
      };
      await fetchPostPrestamo(nuevoPrestamoData);
      toast.success("Préstamo agregado con éxito");
      cargarPrestamos();
    } catch (error) {
      toast.error("Error al añadir el préstamo");
      console.error("Error al añadir el préstamo: ", error);
    }
  };

  const confirmDelete = (idPrestamo) => {
    swal({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el préstamo de forma permanente",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar"],
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        handleDelete(idPrestamo);
      }
    });
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
              onClick={showAddPrestamoModal}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-secondary dark:bg-primary dark:hover:bg-primary focus:outline-none dark:focus:ring-secondary"
            >
              <FaPlus className="h-3.5 w-3.5 mr-2 -ml-1" />
              Agregar Cuenta
            </button>
          </div>
        </div>
      </div>

      {prestamos.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo Cuota
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((cuenta) => (
                <tr
                  key={cuenta.id_prestamo}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/detalle/cuenta/${cuenta.id_prestamo}`)}
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                    Bs. {cuenta.monto}
                  </th>
                  <td className="px-6 py-4">{cuenta.tipoCuota}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(cuenta.id_prestamo);
                      }}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-6 text-gray-500 dark:text-gray-300">
          No hay cuentas pendientes.
        </div>
      )}
    </div>
  );
};

export default Cuentas;
