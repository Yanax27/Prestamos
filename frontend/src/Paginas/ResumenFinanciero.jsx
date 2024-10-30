import React, { useState, useEffect, useContext } from "react";
import { Spinner } from "../components/Spinner";
import { DataContext } from "../context/Provider";
import config from "../config";
import { fetchGetAllUsuarios } from "../http/fetchUsuario";
import { fetchGetCuentaById } from "../http/fetchCuenta";
import CardDataCuenta from "../components/CardDataCuenta"; // Asegúrate de que este componente esté adaptado para usar las props correctamente.

const BancoImagenes = [
  "https://i.ibb.co/MRyknnn/Capital.png",
  "https://i.ibb.co/TKVnDvc/Caja.png",
  "https://i.ibb.co/sWzsKBX/Prestamo.png",
  "https://i.ibb.co/gWFxgJx/Egresos.png",
  "https://i.ibb.co/KmTJx5H/Ingreso.png",
];

const ResumenFinanciero = () => {
  const [cuentaData, setCuentaData] = useState({});
  const [arrayData, setArrayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');

  useEffect(() => {
    const fetchCuentaData = async () => {
      try {
        setLoading(true);
        const usuario = await fetchGetAllUsuarios(email);
        if (usuario && usuario[0]) {
          const cuenta = await fetchGetCuentaById(usuario[0].CuentumIdCuenta);
          if (cuenta) {
            const newArrayData = [
              { title: "Capital", total: cuenta.capital.toFixed(2), rate: "0.5%", levelUp: true },
              { title: "Caja Actual", total: cuenta.cajaActual.toFixed(2), rate: "0.8%", levelUp: true },
              { title: "Ventas", total: cuenta.ventas.toFixed(2), rate: "1.2%", levelUp: true },
              { title: "Caja Ultima Liquidada", total: cuenta.cajaUltimaLiquidacion.toFixed(2), rate: "1.2%", levelUp: true },
              // Agrega otros datos que necesites de `cuenta`
            ];
            setArrayData(newArrayData);
            setCuentaData(cuenta);
          } else {
            console.log("No se encontró la cuenta del usuario");
          }
        } else {
          console.log("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la cuenta: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCuentaData();
  }, [email]);

  const renderResumenFinanciero = () => {
    if (loading) {
      return (
        <div className="flex w-full justify-center items-center">
          <Spinner />
        </div>
      );
    }

    return (
      <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
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
      </>
      
    );
  };

  return renderResumenFinanciero();
};

export default ResumenFinanciero;
