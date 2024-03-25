/*import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { db } from "../data/FIreBase";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/AddDatos.css";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Crear el componente
const AddDatosPrestamos = ({ clienteId, prestamoId }) => {
  const [cuotas, setCuotas] = useState("");
  const [fechaInicial, setFechaInicial] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const [tipoCuota, setTipoCuota] = useState("Diario");
  const [interes, setInteres] = useState("20");
  const [valor, setValor] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showBotonActualizar, setShowBotonActualizar] = useState(false);

  useEffect(() => {
    const loadPrestamoData = async () => {
      console.log("Id llegado para editar " + prestamoId);

      if (prestamoId !== "NewPrestamo") {
        setShowBotonActualizar(true);
        try {
          const docRef = doc(db, "PrestamosDB", clienteId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setCuotas(data.Cuotas);
            setFechaInicial(data.FechaInicial.toDate());
            setFechaFinal(data.FechaFinal.toDate());
            setInteres(data.Interes);
            setTipoCuota(data.TipoCuota);
            setValor(data.Valor);
            console.log("Datos del documento cargados con éxito");
          } else {
            console.log("No se encontró el documento con el ID proporcionado");
          }
        } catch (error) {
          console.error("Error al cargar datos del documento:", error);
        }
      }

      setShowModal(true); // Abre el modal al cargar el componente
    };
    if (tipoCuota === "Diario") {
      setCuotas("24");
    } else if (tipoCuota === "Semanal") {
      setCuotas("4");
    }

    loadPrestamoData();
  }, [clienteId, prestamoId, tipoCuota]);

  const closeModal = () => {
    setShowModal(false); // Cierra el modal
  };

  const handleGuardar = async () => {
    try {
      const nuevoPrestamoData = {
        Cuotas: cuotas,
        FechaInicial: new Date(fechaInicial),
        FechaFinal: new Date(fechaFinal),
        Interes: interes,
        TipoCuota: tipoCuota,
        Valor: valor,
        ClienteId: clienteId
      };

      const CuentaFinalId = "yIIKrEjqotEpdqwAK2Bv";
      const cuentaDocRef = doc(db, "CuentaDB", CuentaFinalId);
      const cuentaDocSnap = await getDoc(cuentaDocRef);

      if (cuentaDocSnap.exists()) {
        const cuentaData = cuentaDocSnap.data();

        // Verificar si Caja_Actual es mayor o igual a valor
        if (cuentaData.Caja_Actual >= parseFloat(valor)) {
          const nuevoCajaActual = cuentaData.Caja_Actual - parseFloat(valor); // Restar el valor del nuevo préstamo
          const nuevoTotalPrestamos =cuentaData.Total_Prestamos + parseFloat(valor); // Sumar el valor del nuevo préstamo
          const nuevoIntereses =cuentaData.Intereses +(parseFloat(interes) * parseFloat(valor)) / 100; // Calcular e sumar los intereses

          await updateDoc(doc(db, "CuentaDB", CuentaFinalId), {
            Caja_Actual: nuevoCajaActual,
            Total_Prestamos: nuevoTotalPrestamos,
            Intereses: nuevoIntereses,
          });
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

  const handleActualizar = async () => {
    try {
      const actualizarPrestamoData = {
        Cuotas: cuotas,
        FechaInicial: fechaInicial,
        FechaFinal: fechaFinal,
        Interes: interes,
        TipoCuota: tipoCuota,
        Valor: valor,
      };

      // Actualizar el préstamo en la colección en Firestore
      await updateDoc(doc(db, "PrestamosDB", clienteId), actualizarPrestamoData);

      setAlertMessage("Actualización Exitosa");
      setShowAlert(true);
      closeModal();
    } catch (error) {
      setAlertMessage("Error al actualizar el préstamo");
      setShowAlert(true);
      console.error("Error al actualizar el préstamo: ", error);
    }
  };

  return (
    <div className="modal">
      {showModal && (
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
          <label>Cuotas:</label>
          <input
            type="text"
            value={cuotas}
            onChange={(e) => setCuotas(e.target.value)}
          />

          <label>Valor:</label>
          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <div className="modal-buttons">
            <button
              className="modal-button save-button"
              onClick={showBotonActualizar ? handleActualizar : handleGuardar}
            >
              <FaCheck />
              {showBotonActualizar ? "Actualizar" : "Guardar"}
            </button>
            <NavLink className="modal-button cancel-button" to={"/DetalleCliente/"+clienteId}>
              <FaTimes />
              Cancelar
            </NavLink>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="custom-alert">
          <p>{alertMessage}</p>
          <NavLink onClick={() => setShowAlert(false)} to={"/DetalleCliente/" + clienteId}>
            Cerrar
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default AddDatosPrestamos;
*/