import React, { useState, useEffect, useContext } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../data/FIreBase";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import "../styles/ResumenFinanciero.css";
import { Spinner } from "../components/Spinner";
import { DataContext } from "../context/Provider";
import config from "../config";

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
  const { authUser, setDataAuth } = useContext(DataContext);

  useEffect(() => {
    const fetchCuentaData = async () => {
      try {
        const cuentaDocRef = doc(db, "CuentaDB", "yIIKrEjqotEpdqwAK2Bv");
        const cuentaDocSnap = await getDoc(cuentaDocRef);

        if (cuentaDocSnap.exists()) {
          const data = cuentaDocSnap.data();
          // Inicializa el array aquí
          const newArrayData = [];
          newArrayData.push({
            Capital: data.Capital.toFixed(2),
            descripcion: "Capital",
          });
          newArrayData.push({
            "Caja actual": data.Caja_Actual.toFixed(2),
            descripcion: "Caja",
          });
          newArrayData.push({
            "Total prestamos": data.Total_Prestamos.toFixed(2),
            descripcion: "Prestamo",
          });
          newArrayData.push({
            Egresos: data.Egresos.toFixed(2),
            descripcion: "Egresos",
          });
          newArrayData.push({
            Ingresos: data.Ingresos.toFixed(2),
            descripcion: "Ingreso",
          });
          setArrayData(newArrayData);
          setCuentaData(data);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching document: ", error);
        setLoading(false);
      }
    };

    fetchCuentaData();
  }, []);

  const renderResumenFinanciero = () => {
    if (loading) {
      return (
        <div className="flex w-full justify-center items-center">
          <Spinner />
        </div>
      );
    }

    const cajaActualPercentage =
      (cuentaData.Caja_Actual / cuentaData.Capital) * 100;
    const interesPercentage = (cuentaData.Intereses / cuentaData.Capital) * 100;
    return (
      <div className="grid grid-cols-6 w-full ">
        <div className="flex flex-cols col-span-6 p-2 gap-4">
          {arrayData.map((obj, index) => {
            const key = Object.keys(obj)[0];
            const value = obj[key];
            return (
              <div
                key={key}
                className={`
                  w-1/5 
                  ${`${config.colors[index]}`} 
                  rounded-lg overflow-hidden 
                  shadow-lg border p-4 flex flex-col hover:cursor-pointer
                  transform hover:scale-105 hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-end justify-end mb-4">
                  <img src={BancoImagenes[index]} className="w-12" alt="" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white text-sm">{key}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-white text-xl font-bold text-white">
                      {value} <span className="text-white">$</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-2 "></div>
        <div className="col-span-4 "></div>
      </div> 
    );
  };

  return renderResumenFinanciero();
};

export default ResumenFinanciero;
