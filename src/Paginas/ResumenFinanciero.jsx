import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../data/FIreBase';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import '../styles/ResumenFinanciero.css';
import { Spinner } from '../components/Spinner';

const ResumenFinanciero = () => {
  const [cuentaData, setCuentaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuentaData = async () => {
      try {
        const cuentaDocRef = doc(db, 'CuentaDB', 'yIIKrEjqotEpdqwAK2Bv');
        const cuentaDocSnap = await getDoc(cuentaDocRef);

        if (cuentaDocSnap.exists()) {
          const data = cuentaDocSnap.data();
          setCuentaData(data);
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document: ', error);
        setLoading(false);
      }
    };

    fetchCuentaData();
  }, []);

  const renderResumenFinanciero = () => {
    if (loading) {
      return <Spinner />;
    }

    const cajaActualPercentage = (cuentaData.Caja_Actual / cuentaData.Capital) * 100;
    const interesPercentage = (cuentaData.Intereses / cuentaData.Capital) * 100;

    return (
      <div className="contenedor-financiero">
        <div className="cont-header">
          <h3 className="titulo">
            Resumen Financiero
          </h3>
        </div>
        <div className="seccion-tarjetas">
          <div className="tarjeta">
            <span className="info-icon"><FiDollarSign /></span>
            <div className="contenido-tarjeta">
              <span className="info-title">Capital:</span>
              <span>{cuentaData.Capital.toFixed(2)}</span>
            </div>
          </div>
          <div className="tarjeta">
            <span className="info-icon"><FiDollarSign /></span>
            <div className="contenido-tarjeta">
              <span className="info-title">Caja Actual:</span>
              <span>{cuentaData.Caja_Actual.toFixed(2)}</span>
            </div>
          </div>
          <div className="tarjeta">
            <span className="info-icon"><FiDollarSign /></span>
            <div className="contenido-tarjeta">
              <span className="info-title">Total Préstamos:</span>
              <span>{cuentaData.Total_Prestamos.toFixed(2)}</span>
            </div>
          </div>
          <div className="tarjeta">
            <span className="info-icon"><FiTrendingDown /></span>
            <div className="contenido-tarjeta">
              <span className="info-title">Egresos:</span>
              <span>{cuentaData.Egresos.toFixed(2)}</span>
            </div>
          </div>
          <div className="tarjeta">
            <span className="info-icon"><FiTrendingUp /></span>
            <div className="contenido-tarjeta">
              <span className="info-title">Ingresos:</span>
              <span>{cuentaData.Ingresos.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="seccion-diagramas">
          <div className="circle-container">
            <div className='circle'>
              <CircularProgressbar
                value={cajaActualPercentage}
                text={`${cajaActualPercentage.toFixed(2)}%`}
                styles={buildStyles({
                  textColor: '#000000',
                  pathColor: '#007bff',
                  trailColor: '#f4f4f4',
                })}
              />
            </div>
            <div className="info-text">
              <span>Caja Actual</span>
              <br />
              <span>Bs. {cuentaData.Caja_Actual.toFixed(2)}</span>
            </div>
          </div>
          <div className="circle-container">
            <div className="circle">
              <CircularProgressbar
                value={interesPercentage}
                text={`${interesPercentage.toFixed(2)}%`}
                styles={buildStyles({
                  textColor: '#000000',
                  pathColor: '#28a745',
                  trailColor: '#f4f4f4',
                })}
              />
            </div>
            <div className="info-text">
              <span>Interés</span>
              <br />
              <span>Bs. {cuentaData.Intereses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderResumenFinanciero();
};

export default ResumenFinanciero;
