import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import swal from "sweetalert";
import { Spinner } from "./Spinner";
import { fetchGetPrestamoById, fetchActualizarEstadosCuotasMasivo } from "../http/fetchPrestamo";
import { fetchPostAbono } from "../http/fetchAbono";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DetalleCuenta = () => {
  const { cuentaId } = useParams();
  const [cuentaData, setCuentaData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const obtenerCuenta = async () => {
    try {
      const data = await fetchGetPrestamoById(cuentaId);
      setCuentaData(data);
    } catch (error) {
      console.error("Error al obtener la cuenta:", error);
    }
  };

  useEffect(() => {
    obtenerCuenta();
  }, [cuentaId]);

  const handleAgregarAbono = async () => {
    const abonoData = await swal({
      title: "Agregar Abono",
      content: {
        element: "div",
        attributes: {
          innerHTML: `
            <div class="swal-content__input-group">
              <input id="abono-monto" type="number" placeholder="Monto en Bs." class="swal-content__input" />
              <input id="abono-fecha" type="date" class="swal-content__input mt-2" />
            </div>
          `,
        },
      },
      buttons: ["Cancelar", "Confirmar"],
    });

    if (abonoData) {
      const monto = document.getElementById("abono-monto").value;
      const fecha = document.getElementById("abono-fecha").value;

      if (monto && fecha) {
        try {
          await fetchPostAbono({
            fecha: fecha,
            monto: parseFloat(monto),
            PrestamoIdPrestamo: cuentaId,
          });

          swal("Éxito", "El abono ha sido agregado correctamente", "success");
          obtenerCuenta();
        } catch (error) {
          swal("Error", "Ocurrió un problema al agregar el abono", "error");
        }
      } else {
        swal("Error", "Por favor, ingrese tanto el monto como la fecha.", "error");
      }
    }
  };

  const handleCuotaClick = async (event) => {
    const { index } = event.resource;
    const estadoActual = cuentaData.verificarPago[index];

    // Validar que solo se pueda pagar la primera cuota pendiente consecutiva
    const primeraCuotaPendiente = cuentaData.verificarPago.findIndex((estado) => estado !== "pagado");
    if (index !== primeraCuotaPendiente) {
      swal("Aviso", "Debe pagar las cuotas en orden. Primero pague la cuota pendiente más cercana.", "warning");
      return;
    }

    const confirmResult = await swal({
      title: `Confirmar pago de cuota #${index + 1}`,
      text: `Estado actual: ${estadoActual}`,
      buttons: {
        pagado: { text: "Marcar como Pagado", value: "pagado", className: "swal-button--green" },
        cancel: "Cancelar",
      },
    });

    if (confirmResult && confirmResult !== "cancel") {
      try {
        await fetchActualizarEstadosCuotasMasivo(cuentaId, [index], confirmResult);
        swal("Éxito", `La cuota #${index + 1} ha sido marcada como ${confirmResult}`, "success");
        obtenerCuenta();
      } catch (error) {
        swal("Error", "Ocurrió un problema al actualizar el estado de la cuota", "error");
      }
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedIndexes = events
      .map((event, i) => (event.start >= slotInfo.start && event.end <= slotInfo.end ? i : null))
      .filter((i) => i !== null && cuentaData.verificarPago[i] !== "pagado");

    // Validar que la selección sea consecutiva y comience con la primera cuota pendiente
    const primeraCuotaPendiente = cuentaData.verificarPago.findIndex((estado) => estado !== "pagado");
    if (selectedIndexes[0] !== primeraCuotaPendiente || !isConsecutive(selectedIndexes)) {
      swal("Error", "Solo puede seleccionar cuotas consecutivas y en orden desde la primera cuota pendiente.", "error");
      return;
    }

    setSelectedEvents(selectedIndexes);
  };

  const isConsecutive = (array) => {
    return array.every((value, index) => index === 0 || value === array[index - 1] + 1);
  };

  const handleBatchUpdate = async () => {
    const confirmResult = await swal({
      title: "Confirmación de cambios masivos",
      text: "¿Desea aplicar el cambio de estado masivo? Este cambio no podrá revertirse.",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    });

    if (confirmResult) {
      try {
        await fetchActualizarEstadosCuotasMasivo(cuentaId, selectedEvents, "pagado");

        swal("Éxito", "Los estados de las cuotas seleccionadas se actualizaron", "success");
        obtenerCuenta();
        setSelectedEvents([]);
      } catch (error) {
        swal("Error", "Ocurrió un problema al actualizar los estados de las cuotas", "error");
      }
    }
  };

  if (!cuentaData) {
    return <Spinner />;
  }

  const {
    numeroCuota,
    fechaInicial,
    interes,
    tipoCuota,
    monto,
    fechas,
    valorCuota,
    PrestarioIdPrestario,
    deudaActual,
    cuotasPagadas,
    saldoAbono,
  } = cuentaData;

  const events = fechas.map((fecha, index) => ({
    title: `Cuota ${index + 1} - ${valorCuota.toFixed(2)} Bs.`,
    start: new Date(fecha),
    end: new Date(fecha),
    allDay: true,
    resource: { index },
  }));

  return (
    <div className="p-4 md:p-8 lg:max-w-4xl mx-auto">
      <div className="flex items-center mb-6 space-x-2">
        <NavLink
          to={`/dashboard/detalle/cliente/${PrestarioIdPrestario}`}
          className="flex items-center text-graydark hover:text-primary"
        >
          <FaArrowLeft className="mr-2" />
          <span>Volver</span>
        </NavLink>
        <h2 className="text-xl font-semibold text-graydark">Detalle de Cuenta</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-whiten shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div className="font-semibold text-sm">
          <strong>Número de Cuotas:</strong> {numeroCuota}
        </div>
        <div className="font-semibold text-sm">
          <strong>Fecha Inicial:</strong> {new Date(fechaInicial).toLocaleDateString()}
        </div>
        <div className="font-semibold text-sm">
          <strong>Deuda Actual:</strong> {deudaActual.toFixed(2)} Bs.
        </div>
        <div className="font-semibold text-sm">
          <strong>Interés:</strong> {interes}%
        </div>
        <div className="font-semibold text-sm">
          <strong>Tipo de Cuota:</strong> {tipoCuota}
        </div>
        <div className="font-semibold text-sm">
          <strong>Monto:</strong> {monto.toFixed(2)} Bs.
        </div>
        <div className="font-semibold text-sm">
          <strong>Valor de Cuota:</strong> {valorCuota.toFixed(2)} Bs.
        </div>
        <div className="font-semibold text-sm">
          <strong>Saldo Abono:</strong> {saldoAbono.toFixed(2)} Bs.
        </div>
        <div className="font-semibold text-sm">
          <strong>Cuotas Pagas:</strong> {cuotasPagadas}
        </div>
      </div>

      <div className="mb-6">
        <h5 className="font-semibold text-lg mb-4">Fechas de Pago</h5>
        <div className="w-full overflow-hidden rounded bg-whiten shadow-md p-4 md:p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "50vh", width: "100%" }}
            className="w-full max-w-full text-sm md:text-base"
            messages={{
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              allDay: "Todo el día",
              week: "Semana",
              work_week: "Semana laboral",
              day: "Día",
              month: "Mes",
              previous: "<",
              next: ">",
              yesterday: "Ayer",
              tomorrow: "Mañana",
              today: "Hoy",
              agenda: "Agenda",
              noEventsInRange: "No hay eventos en este rango",
              showMore: (total) => `+ Ver más (${total})`,
            }}
            selectable
            onSelectEvent={handleCuotaClick}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={(event) => {
              const estado = cuentaData.verificarPago[event.resource.index];
              const isSelected = selectedEvents.includes(event.resource.index);
              const colorMap = {
                pendiente: "#1E3A8A",
                pagoAbono: "#0EA5E9",
                pagado: "#10B981",
              };
              return {
                style: {
                  backgroundColor: isSelected ? "#F59E0B" : colorMap[estado] || "#1E3A8A",
                  color: "white",
                  border: isSelected ? "2px solid #F59E0B" : "none",
                  borderRadius: "5px",
                },
              };
            }}
          />
        </div>
      </div>

      {selectedEvents.length > 0 && (
        <div className="flex justify-center sm:justify-end mb-4">
          <button
            onClick={handleBatchUpdate}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary focus:ring-4 focus:ring-secondary dark:focus:ring-secondary"
          >
            Confirmar cambios masivos
          </button>
        </div>
      )}

      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          onClick={handleAgregarAbono}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary focus:ring-4 focus:ring-secondary dark:focus:ring-secondary w-full sm:w-auto"
        >
          <FaPlus className="mr-2" />
          Agregar Abono
        </button>
      </div>
    </div>
  );
};

export default DetalleCuenta;
