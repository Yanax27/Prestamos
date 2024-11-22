import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import {
  fetchGetPrestarioById,
  fetchPostPrestario,
  fetchPutPrestario,
} from "../http/fetchPrestario";

const AddDatos = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate(); // Hook para navegación
  const { register, handleSubmit, reset } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadClienteData = async () => {
      if (clienteId !== "newClient") {
        setIsEditMode(true);
        try {
          const data = await fetchGetPrestarioById(clienteId);
          if (data) {
            reset(data);
          } else {
            console.log("No se encontró el cliente con el ID proporcionado");
          }
        } catch (error) {
          console.error("Error al cargar datos del cliente:", error);
        }
      }
      setShowModal(true);
    };
    loadClienteData();
  }, [clienteId, reset]);

  const closeModal = () => {
    setShowModal(false);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await fetchPutPrestario(clienteId, data);
        swal("Éxito", "Cliente actualizado correctamente", "success").then(
          () => navigate("/dashboard/clientes")
        );
      } else {
        await fetchPostPrestario(data);
        swal("Éxito", "Cliente registrado correctamente", "success").then(
          () => navigate("/dashboard/clientes")
        );
      }
      closeModal();
    } catch (error) {
      swal("Error", `Error al ${isEditMode ? "actualizar" : "añadir"} el cliente`, "error");
      console.error("Error: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {showModal && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {isEditMode ? "Actualizar Cliente" : "Insertar Cliente"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CI:
              </label>
              <input
                type="text"
                {...register("ci", { required: true })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombres:
              </label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Apellidos:
              </label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dirección:
              </label>
              <input
                type="text"
                {...register("direccion", { required: true })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono:
              </label>
              <input
                type="number"
                {...register("telefono", { required: true })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Negocio:
              </label>
              <input
                type="text"
                {...register("negocio")}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado:
              </label>
              <select
                {...register("estado")}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              >
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
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-white bg-primary rounded-lg hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-secondary"
              >
                <FaCheck className="mr-2" />
                {isEditMode ? "Actualizar" : "Guardar"}
              </button>
              <NavLink
                to="/dashboard/clientes"
                className="flex items-center px-4 py-2 text-white bg-danger rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500"
              >
                <FaTimes className="mr-2" />
                Cancelar
              </NavLink>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddDatos;
