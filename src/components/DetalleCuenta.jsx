import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
    };

    const handleCancelarAbono = () => {
        setAbonoModalOpen(false);
        setAbonoValue("");
    };

    const handleConfirmarAbono = async () => {
        try {
            const abonoNumber = parseFloat(abonoValue);
            const updatedTotalAbonos = cuentaData.TotalAbonos + parseFloat(abonoNumber);
            const updatedDeuda = cuentaData.DeudaActual - parseFloat(abonoNumber);

            // Calcular el nuevo valor de la cuota
            const pagosPendientes = cuentaData.VerificaPago.filter(pago => !pago).length;
            const nuevoValorCuota = (parseFloat(updatedDeuda) / parseFloat(pagosPendientes)).toFixed(2);

            await updateDoc(doc(db, "PrestamosDB", cuentaId), {
                TotalAbonos: updatedTotalAbonos,
                DeudaActual: updatedDeuda,
                ValorCuota: parseFloat(nuevoValorCuota)
            });

            setAbonoModalOpen(false);
            setAbonoValue("");
            // Actualizar datos en estado local si es necesario
            setCuentaData(prevData => ({
                ...prevData,
                TotalAbonos: updatedTotalAbonos,
                DeudaActual: updatedDeuda,
                ValorCuota: parseFloat(nuevoValorCuota)
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
                <NavLink className="volver-btn" to={`/DetalleCliente/${ClienteId}`}>
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
                <div className="fechas-header">
                    <h3>Fechas de Pago</h3>
                    <button className="agregar-abono-btn" onClick={handleAgregarAbono}>
                        <FaPlus size={16} />
                        Agregar Abono
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
                            <div className="numero-tarjeta">{index + 1}</div>
                            <div className="fecha-tarjeta">{new Date(fecha.toDate()).toLocaleDateString()}</div>
                            <div className="monto-tarjeta">{ValorCuota.toFixed(2)} Bs.</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de confirmación para confirmar el pago */}
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
                        <p>Ingrese valor de Abono:</p>
                        <input
                            type="text"
                            value={abonoValue}
                            onChange={(e) => setAbonoValue(e.target.value)}
                            placeholder="Ingrese el valor"
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
