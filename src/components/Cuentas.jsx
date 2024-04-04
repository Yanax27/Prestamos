import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { collection, query, onSnapshot, deleteDoc, doc, where, addDoc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../data/FIreBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Cuentas.css";
import config from "../config";
import { Link, NavLink } from "react-router-dom";

const Cuentas = ({ clienteId }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nrocuotas, setNrocuotas] = useState(24);
  const [fechaInicial, setFechaInicial] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const [tipoCuota, setTipoCuota] = useState("Diario");
  const [interes, setInteres] = useState(20);
  const [monto, setMonto] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showBotonActualizar, setShowBotonActualizar] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);


  useEffect(() => {
    if (clienteId) {
      const q = query(
        collection(db, "PrestamosDB"),
        where("ClienteId", "==", clienteId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cuentasArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPrestamos(cuentasArray);
      });

      return () => unsubscribe();
    }
  }, [clienteId]);

  useEffect(() => {
    // Actualizar la cantidad de cuotas según el tipo de cuota seleccionado
    if (tipoCuota === "Diario") {
      setNrocuotas(24);
    } else if (tipoCuota === "Semanal") {
      setNrocuotas(4);
    }
  }, [tipoCuota]);
  //borra cuenta
  const handleDelete = async (id, nombre) => {
    if (window.confirm("¿Estás seguro de deseas eliminar la cuenta de " + nombre + "?")) {
      try {
        const cuentaDocRef = doc(db, "CuentaDB", config.cuentaFinalId);
        const cuentaDocSnap = await getDoc(cuentaDocRef);

        if (cuentaDocSnap.exists()) {
          const cuentaData = cuentaDocSnap.data();

          const cuentaEliminarRef = doc(db, "PrestamosDB", id);
          const cuentaEliminarSnap = await getDoc(cuentaEliminarRef);

          if (cuentaEliminarSnap.exists()) {
            const cuentaEliminarData = cuentaEliminarSnap.data();

            // Restar el valor de la cuenta eliminada a Total_Prestamos
            const nuevoTotalPrestamos = cuentaData.Total_Prestamos - parseFloat(cuentaEliminarData.Monto);
            // Sumar el valor de la cuenta eliminada a Caja_Actual
            const nuevoCajaActual = cuentaData.Caja_Actual + parseFloat(cuentaEliminarData.Monto);

            // Actualizar los datos en la base de datos
            await Promise.all([
              updateDoc(cuentaDocRef, { Total_Prestamos: nuevoTotalPrestamos }),
              updateDoc(cuentaDocRef, { Caja_Actual: nuevoCajaActual }),
              deleteDoc(cuentaEliminarRef),
            ]);

            alert("Se ha eliminado la cuenta de " + nombre);
          } else {
            console.log("La cuenta a eliminar no existe.");
          }
        } else {
          console.log("No se encontró la cuenta principal.");
        }
      } catch (error) {
        console.error("Error al eliminar la cuenta: ", error);
      }
    }
  };

  //abre fomrulario de nuevo prestamos
  const handleNuevoPrestamo = () => {
    setMostrarFormulario(true);
    setShowModal(true);
  };
  //cierra  formulario y limpia campos del formulario
  const handleClosePrestamo = () => {
    setMostrarFormulario(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setMostrarFormulario(false);
  };
  // Guardar nuevo prestamos
  const handleGuardar = async () => {
    try {
      // recupera id cuenta para recuperar datos de capital, caja_actual etc     
      const cuentaDocRef = doc(db, "CuentaDB", config.cuentaFinalId);
      const cuentaDocSnap = await getDoc(cuentaDocRef);
      //consulta si existe  cuenta con dicho id
      if (cuentaDocSnap.exists()) {
        const cuentaData = cuentaDocSnap.data();
        //verifica si caja acutal  es mayor o igual a valor a prestar para poder prestar
        if (cuentaData.Caja_Actual >= parseFloat(monto)) {
          const nuevoCajaActual = cuentaData.Caja_Actual - parseFloat(monto);
          const nuevoTotalPrestamos = cuentaData.Total_Prestamos + parseFloat(monto);
          const nuevoIntereses = cuentaData.Intereses + (parseFloat(interes) * parseFloat(monto)) / 100;
          //actuliza los datos de la cuenta
          await updateDoc(doc(db, "CuentaDB", config.cuentaFinalId), {
            Caja_Actual: nuevoCajaActual,
            Total_Prestamos: nuevoTotalPrestamos,
            Intereses: nuevoIntereses,
          });

          const fechas = [];
          const verificaPago = Array.from({ length: nrocuotas }, () => false); // Inicialización del array verificaPago con valores booleanos en falso
          // Convertir la fecha inicial a un objeto Timestamp
          let fechaActual = Timestamp.fromDate(fechaInicial);
          // Calcular el intervalo de días basado en el tipo de cuota
          const intervalo = tipoCuota === "Semanal" ? 7 : 1;
          // Agregar la fecha inicial al array
          fechas.push(fechaActual);

          // Calcular las fechas restantes y agregarlas al array
          for (let i = 1; i < nrocuotas; i++) {
            const nuevaFecha = new Date(fechaActual.toMillis());
            nuevaFecha.setDate(nuevaFecha.getDate() + intervalo); // Añadir el intervalo de días
            fechas.push(Timestamp.fromDate(nuevaFecha));
            fechaActual = Timestamp.fromDate(nuevaFecha);
          }

          const valorInteres = (parseFloat(monto) * (parseFloat(interes / 100)));
          const valorCuota = (parseFloat(monto) + parseFloat(valorInteres)) / parseFloat(nrocuotas);
          const deudaActual = parseFloat(monto) + parseFloat(valorInteres);

          const nuevoPrestamoData = {
            NroCuotas: nrocuotas,
            FechaInicial: new Date(fechaInicial),
            FechaFinal: new Date(fechaFinal),
            Interes: interes,
            TipoCuota: tipoCuota,
            Monto: parseFloat(monto),
            ClienteId: clienteId,
            Fechas: fechas,
            ValorCuota: valorCuota,
            DeudaActual: deudaActual,
            VerificaPago: verificaPago,
            TotalAbonos: 0,
          };

          //guarda el nuevo prestamo en BD
          await addDoc(collection(db, "PrestamosDB"), nuevoPrestamoData);
          setAlertMessage("Registro Exitoso");
          setShowAlert(true);
          closeModal();
        } else {
          setAlertMessage("Error: Caja_Actual insuficiente para realizar el préstamo");
          setShowAlert(true);
        }
      }
    } catch (error) {
      setAlertMessage("Error al añadir el préstamo");
      setShowAlert(true);
      console.error("Error al añadir el préstamo: ", error);
    }
  };


  return (
    <div className="table-content">
      <div class="w-full max-w-screen-xl px-4 mx-auto lg:px-12">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h2 class="mr-3 font-semibold dark:text-white">Cuentas</h2>
            </div>
            <button type="button"
              onClick={handleNuevoPrestamo}
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Agregar Cuenta
            </button>
          </div>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showBotonActualizar ? "Actualizar" : "Insertar"} Préstamo</h2>

            <label>Fecha Inicial:</label>
            <DatePicker
              selected={fechaInicial}
              onChange={(date) => setFechaInicial(date)}
            />

            <label>Fecha Final:</label>
            <DatePicker
              selected={fechaFinal}
              onChange={(date) => setFechaFinal(date)}
            />

            <label>Interés:</label>
            <input
              type="text"
              value={interes}
              onChange={(e) => setInteres(e.target.value)}
            />

            <label>Tipo Cuota:</label>
            <select
              value={tipoCuota}
              onChange={(e) => setTipoCuota(e.target.value)}
            >
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
            </select>
            <label>NroCuotas:</label>
            <input
              type="text"
              value={nrocuotas}
              onChange={(e) => setNrocuotas(e.target.value)}
            />

            <label>Monto:</label>
            <input
              type="text"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="modal-button save-button"
                onClick={handleGuardar}
              >
                <FaCheck />
                {showBotonActualizar ? "Actualizar" : "Guardar"}
              </button>
              <button className="modal-button cancel-button" onClick={handleClosePrestamo}>
                <FaTimes />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="custom-alert">
          <p>{alertMessage}</p>
          <button onClick={() => setShowAlert(false)}>
            Cerrar
          </button>
        </div>
      )}

      {!mostrarFormulario && (
        prestamos.length > 0 ? (
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Monto
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Tipo Cuota
                  </th>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Eliminar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((cuenta) => (
                  <tr key={cuenta.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Bs. {cuenta.Monto}
                    </th>
                    <td class="px-6 py-4">
                      {cuenta.TipoCuota}
                    </td>
                    <td class="px-6 py-4 text-right">
                    <span class="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <Link to={"/dashboard/detalle/cuenta/"+cuenta.id}>
                      <button class=" text-blue-700 inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Delete Product">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke-width="1.5"  stroke="currentColor"  class="h-4 w-4"  >
                          <path  stroke-linecap="round"  stroke-linejoin="round"  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"  />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      </Link>
                      <button class=" text-red-700 inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative" title="Delete Product" onClick={() => handleDelete(cuenta.id, cuenta.Nombres)}>
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
        ) : (
          <p>No tiene prestamos pendientes</p>
        )
      )}
    </div>
  );
};
export default Cuentas;
/*
 <table className="table-custom">
            <thead>
              <tr>
                <th className="th-custom"> Monto </th>
                <th className="th-custom"> Acciones </th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((cuenta) => (
                <tr key={cuenta.id}>
                  <td className="td-custom">{cuenta.Monto}</td>
                  <td className="td-custom">
                    <NavLink
                      to={"/DetalleCuenta/" + cuenta.id}
                      className="ver-custom"
                    >
                      <FaEye />
                    </NavLink>
                    <button
                      className="delete-custom"
                      onClick={() => handleDelete(cuenta.id, cuenta.Nombres)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
*/





/**
  <NavLink
                    to={"/DetalleCuenta/" + cuenta.id}
                    className="ver-custom"
                  >
                    <FaEye />
                  </NavLink>
                  <button
                    className="delete-custom"
                    onClick={() => handleDelete(cuenta.id, cuenta.Nombres)}
                  >
                    <FaTrash />
                  </button>
 */

//actualiza datos de prestamos
/*const handleActualizar = async (prestamo) => {
  setSelectedPrestamo(prestamo);
  setMostrarFormulario(true);
  setShowBotonActualizar(true);
  try {
    const actualizarPrestamoData = {
      NroCuotas: nrocuotas,
      FechaInicial: fechaInicial,
      FechaFinal: fechaFinal,
      Interes: interes,
      TipoCuota: tipoCuota,
      Monto: monto,
    };

    await updateDoc(doc(db, "PrestamosDB", clienteId), actualizarPrestamoData);

    setAlertMessage("Actualización Exitosa");
    setShowAlert(true);
    closeModal();
  } catch (error) {
    setAlertMessage("Error al actualizar el préstamo");
    setShowAlert(true);
    console.error("Error al actualizar el préstamo: ", error);
  }
};*/
