import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { db } from "../data/FIreBase";
import { NavLink } from "react-router-dom";
import "../styles/AddDatos.css";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const AddDatos = () => {
  const { clienteId } = useParams();

  const [ci, setCi] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [negocio, setNegocio] = useState("");
  const [estado, setEstado] = useState("Abonó");

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showBotonActualizar, setShowBotonActualizar] = useState(false);

  useEffect(() => {
    const loadClienteData = async () => {
      console.log("Id llegado para editar " + clienteId);

      if (clienteId !== "newClient") {
        setShowBotonActualizar(true);
        try {
          const docRef = doc(db, "PrestamoDBA", clienteId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setCi(data.CI);
            setNombres(data.Nombres);
            setApellidos(data.Apellidos);
            setDireccion(data.Direccion);
            setTelefono(data.Telefono);
            setNegocio(data.Negocio);
            setEstado(data.Estado);
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

    loadClienteData();
  }, [clienteId]);

  const closeModal = () => {
    setShowModal(false); // Cierra el modal
  };

  const handleGuardar = async () => {
    try {
      const nuevoClienteData = {
        CI: ci,
        Nombres: nombres,
        Apellidos: apellidos,
        Direccion: direccion,
        Telefono: telefono,
        Negocio: negocio,
        Estado: estado,
      };

      // Agregar el nuevo cliente a la colección en Firestore
      const docRef = await addDoc(
        collection(db, "PrestamoDBA"),
        nuevoClienteData
      );
    
      setAlertMessage("Registro Exitoso");
      setShowAlert(true);
      closeModal();
    } catch (error) {
      setAlertMessage("Error al añadir el cliente");
      setShowAlert(true);
      console.error("Error al añadir el cliente: ", error);
    }
  };
  const handleActualizar = async () => {
    try {
      const ActulizarClienteData = {
        CI: ci,
        Nombres: nombres,
        Apellidos: apellidos,
        Direccion: direccion,
        Telefono: telefono,
        Negocio: negocio,
        Estado: estado,
      };

      // Agregar el nuevo cliente a la colección en Firestore
      const docRef = await updateDoc(doc(db, "PrestamoDBA",clienteId), ActulizarClienteData);
    
      setAlertMessage("Actualizacion Exitosa");
      setShowAlert(true);
      closeModal();
    } catch (error) {
      setAlertMessage("Error al actualizar el cliente");
      setShowAlert(true);
      console.error("Error al actualizar el cliente: ", error);
    }
  };

 
  return (
    <div className="modal">
      {showModal && (
        <div className="modal-content">
          <h2>Insertar Cliente</h2>
          <label>Ci:</label>
          <input
            type="text"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />

          <label>Nombres:</label>
          <input
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />

          <label>Apellidos:</label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />

          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

          <label>Teléfono:</label>
          <input
            type="number"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <label>Negocio:</label>
          <input
            type="text"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
          />

          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Deudor">Abonó</option>
            <option value="Cambio Casa">Cambio Casa</option>
            <option value="Cerrado">Cerrado</option>
            <option value="De viaje">De viaje</option>
            <option value="Enfermo">Enfermo</option>
            <option value="Mañana Paga doble">Mañana Paga doble</option>
            <option value="No hay Nadie">No hay Nadie</option>
            <option value="No tiene Dinero">No tiene Dinero</option>
            <option value="Otro">Otro</option>
            <option value="Pago ayer doble">Pago ayer doble</option>
            <option value="Paga semana">Paga semana</option>
            <option value="Terminó">Terminó</option>
            <option value="Volado">Volado</option>
          </select>

          <div className="modal-buttons">
            {showBotonActualizar ? (
              <button
                className="modal-button save-button"
                onClick={handleActualizar}
              >
                <FaCheck />
                Actualizar
              </button>
            ) : (
              <button
                className="modal-button save-button"
                onClick={handleGuardar}
              >
                <FaCheck />
                Guardar
              </button>
            )}
            <NavLink className="modal-button cancel-button" to="/Clientes">
              <FaTimes />
              Cancelar
            </NavLink>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="custom-alert">
          <p>{alertMessage}</p>
          <NavLink onClick={() => setShowAlert(false)} to={"/Clientes"}>
            Cerrar
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default AddDatos;
