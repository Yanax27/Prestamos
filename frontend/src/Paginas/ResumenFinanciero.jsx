import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/Spinner";
import { fetchAllUsuarios, fetchCuentaById } from "../redux-toolkit/actions/financieroActions";
import CardDataCuenta from "../components/CardDataCuenta";

const BancoImagenes = [
  "https://i.ibb.co/MRyknnn/Capital.png",
  "https://i.ibb.co/TKVnDvc/Caja.png",
  "https://i.ibb.co/sWzsKBX/Prestamo.png",
  "https://i.ibb.co/gWFxgJx/Egresos.png",
  "https://i.ibb.co/KmTJx5H/Ingreso.png",
];

const ResumenFinanciero = () => {
  const dispatch = useDispatch();
  const { usuarios, cuenta, loading, error } = useSelector((state) => state.financiero); // Estado desde Redux
  const email = useSelector((state) => state.auth.user?.email); // Obtener email del usuario autenticado
  
  useEffect(() => {
    if (email) {
      dispatch(fetchAllUsuarios(email));
    }
  }, [dispatch]);

  useEffect(() => {
    if (usuarios?.length > 0 && usuarios[0].CuentumIdCuenta) {
      dispatch(fetchCuentaById(usuarios[0].CuentumIdCuenta));
    }
  }, [dispatch, usuarios]);

  const renderResumenFinanciero = () => {
    if (loading) {
      return (
        <div className="flex w-full justify-center items-center h-full">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex w-full justify-center items-center h-full">
          <p className="text-red-500">Error al cargar los datos: {error}</p>
        </div>
      );
    }

    if (!cuenta) {
      return (
        <div className="flex w-full justify-center items-center h-full">
          <p>No se encontraron datos financieros.</p>
        </div>
      );
    }

    const arrayData = [
      { title: "Capital", total: cuenta.capital.toFixed(2), rate: "0.5%", levelUp: true },
      { title: "Caja Actual", total: cuenta.cajaActual.toFixed(2), rate: "0.8%", levelUp: true },
      { title: "Ventas", total: cuenta.ventas.toFixed(2), rate: "1.2%", levelUp: true },
      { title: "Caja Ultima Liquidada", total: cuenta.cajaUltimaLiquidacion.toFixed(2), rate: "1.2%", levelUp: true },
    ];

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
        {arrayData.map((item, index) => (
          <CardDataCuenta
            key={index}
            title={item.title}
            total={`Bs.${item.total}`}
            rate={item.rate}
            levelUp={item.levelUp}
          >
            <img src={BancoImagenes[index]} className="w-12" alt={`${item.title} icon`} />
          </CardDataCuenta>
        ))}
      </div>
    );
  };

  return renderResumenFinanciero();
};

export default ResumenFinanciero;
