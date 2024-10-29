import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import "../styles/AddDatos.css";
import { useForm } from "react-hook-form";
import { fetchGetPrestarioById, fetchPostPrestario, fetchPutPrestario } from "../http/fetchPrestario"; // Ajusta la ruta según tu estructura

const AddDatos = () => {
  const { clienteId } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadClienteData = async () => {
      if (clienteId !== "newClient") {
        setIsEditMode(true);
        try {
          const data = await fetchGetPrestarioById(clienteId);
          if (data) {
            reset(data); // Rellena el formulario con los datos del cliente
            console.log("Datos del cliente cargados con éxito");
          } else {
            console.log("No se encontró el cliente con el ID proporcionado");
          }
        } catch (error) {
          console.error("Error al cargar datos del cliente:", error);
        }
      }

      setShowModal(true); // Abre el modal al cargar el componente
    };

    loadClienteData();
  }, [clienteId, reset]);

  const closeModal = () => {
    setShowModal(false); // Cierra el modal
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        // Actualizar cliente
        await fetchPutPrestario(clienteId, data);
        setAlertMessage("Actualización Exitosa");
      } else {
        // Agregar nuevo cliente
        await fetchPostPrestario(data);
        setAlertMessage("Registro Exitoso");
      }
      setShowAlert(true);
      closeModal();
    } catch (error) {
      setAlertMessage(`Error: ${isEditMode ? "al actualizar" : "al añadir"} el cliente`);
      setShowAlert(true);
      console.error("Error: ", error);
    }
  };

  return (
    <div className="modal">
      {showModal && (
        <div className="modal-content">
          <h2>{isEditMode ? "Actualizar Cliente" : "Insertar Cliente"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>CI:</label>
            <input
              type="text"
              {...register("ci", { required: true })}
            />

            <label>Nombres:</label>
            <input
              type="text"
              {...register("nombre", { required: true })}
            />

            <label>Apellidos:</label>
            <input
              type="text"
              {...register("apellido", { required: true })}
            />

            <label>Dirección:</label>
            <input
              type="text"
              {...register("direccion", { required: true })}
            />

            <label>Teléfono:</label>
            <input
              type="number"
              {...register("telefono", { required: true })}
            />

            <label>Negocio:</label>
            <input
              type="text"
              {...register("negocio")}
            />

            <label>Estado:</label>
            <select {...register("estado")}>
              <option value="Abonó">Abonó</option>
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
              <button type="submit" className="modal-button save-button">
                <FaCheck />
                {isEditMode ? "Actualizar" : "Guardar"}
              </button>
              <NavLink className="modal-button cancel-button" to="/dashboard/clientes">
                <FaTimes />
                Cancelar
              </NavLink>
            </div>
          </form>
        </div>
      )}
      {showAlert && (
        <div className="custom-alert">
          <p>{alertMessage}</p>
          <NavLink onClick={() => setShowAlert(false)} to={"/dashboard/clientes"}>
            Cerrar
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default AddDatos;
