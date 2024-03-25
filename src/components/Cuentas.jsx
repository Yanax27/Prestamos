import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { collection, query, onSnapshot, deleteDoc, doc, where, addDoc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../data/FIreBase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Cuentas.css";
import config from "../config";
import { NavLink } from "react-router-dom";

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
      <div className="table-header-custom">
        <h2>Cuentas</h2>
        <button className="add-custom" onClick={handleNuevoPrestamo}>
          <FaPlus /> Nuevo Prestamo
        </button>
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
      ) : (
        <p>No tiene prestamos pendientes</p>
      )
    )}
  </div>
  );
};

export default Cuentas;
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
