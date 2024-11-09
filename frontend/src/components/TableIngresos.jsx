import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../components/Spinner";
import {
  fetchGetAllIngresos,
  fetchPostIngreso,
} from "../http/fetchIngreso"; // Importamos las funciones del backend
import { fetchGetAllUsuarios } from "../http/fetchUsuario";

export const TableIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [button, setButton] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '' );
  const [cuentaId, setCuentaId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const cargarIngresos = async () => {
    setLoading(true);
    const usuario = await fetchGetAllUsuarios(email);
    setCuentaId(usuario[0].CuentumIdCuenta);
    try {
      const data = await fetchGetAllIngresos(cuentaId); // Llamada con el filtro
      setIngresos(data);
    } catch (error) {
      console.error("Error al cargar ingresos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarIngresos();
  }, [cuentaId]);

  const handleAgregarIngreso = async (formData) => {
    setButton(true);
    try {
      const nuevoIngreso = {
        concepto: formData.concepto,
        monto: formData.monto,
        fecha: formData.fecha,
        CuentumIdCuenta: cuentaId, // Asigna la cuenta actual
      };
      await fetchPostIngreso(nuevoIngreso);
      setModalForm(false);
      reset();
      cargarIngresos(); // Actualizar la lista después de agregar
    } catch (error) {
      console.error("Error al agregar ingreso:", error);
    }
    setButton(false);
  };

  return (
    <div className="grid w-full">
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <h2 className="text-lg leading-6 text-gray-900 dark:text-white">
                Ingresos
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setModalForm(true)}
                  type="button"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-secondary dark:bg-primary dark:hover:bg-primary focus:outline-none dark:focus:ring-secondary"
                >
                  Añadir ingreso
                </button>
                <button
                  id="filterDropdownButton"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Filtrar
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <Spinner />
              ) : (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Concepto
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Monto
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((ing) => (
                      <tr key={ing.id_ingreso} className="border-b dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {ing.concepto}
                        </th>
                        <td className="px-4 py-3">{ing.monto}</td>
                        <td className="px-4 py-3">
                          {new Date(ing.fecha).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal de Formulario de Ingreso */}
            {modalForm && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={() => setModalForm(false)}
                  ></div>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Registrar ingreso
                      </h3>
                      <form
                        onSubmit={handleSubmit(handleAgregarIngreso)}
                        className="space-y-4 mt-4"
                      >
                        <div>
                          <label
                            htmlFor="concepto"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Concepto
                          </label>
                          <input
                            type="text"
                            id="concepto"
                            {...register("concepto", {
                              required: "El concepto es requerido",
                              minLength: { value: 3, message: "Mínimo 3 caracteres" },
                              maxLength: { value: 30, message: "Máximo 30 caracteres" },
                            })}
                            className="mt-1 block w-full p-2 border rounded-md"
                            placeholder="Ingrese el concepto"
                          />
                          {errors.concepto && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.concepto.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="monto"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Monto
                          </label>
                          <input
                            type="number"
                            id="monto"
                            min="1"
                            {...register("monto", {
                              required: "El monto es requerido",
                              valueAsNumber: true,
                            })}
                            className="mt-1 block w-full p-2 border rounded-md"
                            placeholder="Ingrese el monto"
                          />
                          {errors.monto && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.monto.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="fecha"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Fecha
                          </label>
                          <input
                            type="date"
                            id="fecha"
                            {...register("fecha", {
                              required: "La fecha es requerida",
                              valueAsDate: true,
                            })}
                            className="mt-1 block w-full p-2 border rounded-md"
                          />
                          {errors.fecha && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.fecha.message}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setModalForm(false)}
                            className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cerrar
                          </button>
                          <button
                            type="submit"
                            disabled={button || Object.keys(errors).length > 0}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            {button ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
