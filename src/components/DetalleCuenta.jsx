import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../data/FIreBase";
import { NavLink, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa"; // Importar el icono FaPlus
import "../styles/DetalleCuenta.css";
import { Spinner } from "./Spinner";

const DetalleCuenta = () => {
    const { cuentaId } = useParams();
    const [cuentaData, setCuentaData] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [abonoModalOpen, setAbonoModalOpen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [abonoValue, setAbonoValue] = useState("");
    const [abonoFecha, setAbonoFecha] = useState("");


    useEffect(() => {
        const obtenerCuenta = async () => {
            try {
                const docRef = doc(db, "PrestamosDB", cuentaId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCuentaData(data);
                } else {
                    console.log("No existe el documento con el ID proporcionado.");
                }
            } catch (error) {
                console.error("Error al obtener la cuenta:", error);
            }
        };

        obtenerCuenta();
    }, [cuentaId]);

    const handleConfirm = async () => {
        try {
            const updatedDeuda = cuentaData.DeudaActual - cuentaData.ValorCuota;
            const updatedVerificaPago = cuentaData.VerificaPago.map((value, index) =>
                index === selectedCardIndex ? true : value
            );

            await updateDoc(doc(db, "PrestamosDB", cuentaId), {
                DeudaActual: updatedDeuda,
                VerificaPago: updatedVerificaPago
            });

            setConfirmModalOpen(false);
            setSelectedCardIndex(null);
            // Actualizar datos en estado local si es necesario
            setCuentaData(prevData => ({
                ...prevData,
                DeudaActual: updatedDeuda,
                VerificaPago: updatedVerificaPago
            }));
        } catch (error) {
            console.error("Error al confirmar el pago:", error);
        }
    };

    const handleAgregarAbono = () => {
        setAbonoModalOpen(true);
        setAbonoValue("");
        setAbonoFecha("");
    };


    const handleCancelarAbono = () => {
        setAbonoModalOpen(false);
        setAbonoValue("");
        setAbonoFecha("");
    };

    //confirmacion de abono
    const handleConfirmarAbono = async () => {
        try {
            // Convertir la fecha a formato de Firestore
            const [dia, mes, año] = abonoFecha.split("/");
            const fechaFirestore = `${dia}-${mes}-${año}`;

            const abonoNumber = parseFloat(abonoValue);
            const updatedTotalAbonos = cuentaData.TotalAbonos + abonoNumber;
            const updatedDeuda = cuentaData.DeudaActual - abonoNumber;

            // Agregar el abono a la colección "Abono"
            await addDoc(collection(db, "Abono"), {
                Fecha: fechaFirestore,
                Monto: abonoNumber,
                PrestamoId: cuentaId
            });
            await updateDoc(doc(db, "PrestamosDB", cuentaId), {
                TotalAbonos: updatedTotalAbonos,
            });

            setAbonoModalOpen(false);
            setAbonoValue("");
            setAbonoFecha("");

            // Actualizar datos en estado local si es necesario
            setCuentaData(prevData => ({
                ...prevData,
                TotalAbonos: updatedTotalAbonos,
            }));
        } catch (error) {
            console.error("Error al confirmar el abono:", error);
        }
    };

    if (!cuentaData) {
        return <Spinner />;
    }

    const { NroCuotas, FechaInicial, Interes, TipoCuota, Monto, Fechas, ValorCuota, ClienteId, DeudaActual, VerificaPago, TotalAbonos } = cuentaData;

    return (
        <div className="detalle-cuenta">
            <div className="header">
                <NavLink className="volver-btn" to={`/dashboard/detalle/cliente/${ClienteId}`}>
                    <FaArrowLeft size={20} />
                    <span>Volver</span>
                </NavLink>
                <h2>Detalle de Cuenta</h2>
            </div>
            <div className="cuenta-info">
                <div className="campo">
                    <strong>Número de Cuotas:</strong> {NroCuotas}
                </div>
                <div className="campo">
                    <strong>Fecha Inicial:</strong> {new Date(FechaInicial.toDate()).toLocaleDateString()}
                </div>
                <div className="campo">
                    <strong>Deuda Actual:</strong> {DeudaActual.toFixed(2)} Bs.
                </div>
                <div className="campo">
                    <strong>Interés:</strong> {Interes}%
                </div>
                <div className="campo">
                    <strong>Tipo de Cuota:</strong> {TipoCuota}
                </div>
                <div className="campo">
                    <strong>Monto:</strong> {Monto.toFixed(2)} Bs.
                </div>
                <div className="campo">
                    <strong>Valor de Cuota:</strong> {ValorCuota.toFixed(2)} Bs.
                </div>
                <div className="campo">
                    <strong>Abonos Totales:</strong> {TotalAbonos.toFixed(2)} Bs.
                </div>
            </div>

            <div className="fechas-container">
                <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                    <div>
                        <h5 class="mr-3 font-semibold dark:text-white">Fechas de Pago</h5>
                    </div>
                    <button type="button"
                        onClick={handleAgregarAbono}
                        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                        <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Agregar Abono
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-t-lg md:rounded-tr-none md:rounded-l-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white">
                        Ver Abonos
                    </button>
                </div>
                <div className="tarjetas-fechas">

                    {Fechas.map((fecha, index) => (
                        <div
                            className={`tarjeta-fecha ${VerificaPago && VerificaPago[index] ? "confirmed" : ""}`}
                            key={index}
                            onClick={() => {
                                if (!VerificaPago[index]) {
                                    setConfirmModalOpen(true);
                                    setSelectedCardIndex(index);
                                }
                            }}
                        >
                            <div class="flex items-center">
                                &#8203;
                                <input type="checkbox" class="size-4 rounded border-gray-300" id="Option1" />
                            </div>
                            <div className="numero-tarjeta">{index + 1}</div>
                            <div className="fecha-tarjeta">{new Date(fecha.toDate()).toLocaleDateString()}</div>
                            <div className="monto-tarjeta">{ValorCuota.toFixed(2)} Bs.</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de confirmación para confirmar el pago de cuota */}
            {confirmModalOpen && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <p>¿Desea confirmar el pago de la cuota?</p>
                        <div className="buttons">
                            <button onClick={handleConfirm}>Confirmar</button>
                            <button onClick={() => setConfirmModalOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para agregar abono */}
            {abonoModalOpen && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <p>Ingrese Abono:</p>
                        <input
                            type="text"
                            value={abonoValue}
                            onChange={(e) => setAbonoValue(e.target.value)}
                            placeholder="Ingrese el valor"
                        />
                        <input
                            type="text"
                            value={abonoFecha}
                            onChange={(e) => setAbonoFecha(e.target.value)}
                            placeholder="Ingrese la fecha (dd/mm/aaaa)"
                        />
                        <div className="buttons">
                            <button className="confirmar-btn" onClick={handleConfirmarAbono}>Confirmar</button>
                            <button className="cancelar-btn" onClick={handleCancelarAbono}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

};

export default DetalleCuenta;
