import React, { useState, useEffect } from 'react';
import { db } from '../data/FIreBase';
import {
    collection,
    query,
    onSnapshot,
    addDoc
} from "firebase/firestore";
import '../styles/IngresoEgreso.css';
import { Spinner } from '../components/Spinner';

const IngresoEgreso = () => {
    console.log("ingreso");
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [nuevoIngreso, setNuevoIngreso] = useState({ concepto: '', monto: '', fecha: new Date() });
    const [nuevoEgreso, setNuevoEgreso] = useState({ concepto: '', monto: '', fecha: new Date() });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarIngresos = async () => {
            const ingresosQuery = query(collection(db, 'ingresos'));
            const unsubscribeIngresos = onSnapshot(ingresosQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setIngresos(data);
            });
            return unsubscribeIngresos;
        };

        const cargarEgresos = async () => {
            const egresosQuery = query(collection(db, 'egresos'));
            const unsubscribeEgresos = onSnapshot(egresosQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEgresos(data);
            });
            return unsubscribeEgresos;
        };

        const cargarDatos = async () => {
            await cargarIngresos();
            await cargarEgresos();
            setLoading(false);
        };

        cargarDatos();

        // Cleanup
        return () => {
            <Spinner />
        };
    }, []);


    const handleAgregarIngreso = async () => {
        if (nuevoIngreso.concepto.trim() !== '' && nuevoIngreso.monto.trim() !== '') {
            try {
                await addDoc(collection(db, 'ingresos'), {
                    Monto: parseFloat(nuevoIngreso.monto),
                    Concepto: nuevoIngreso.concepto,
                    Fecha: nuevoIngreso.fecha
                });
                setNuevoIngreso({ concepto: '', monto: '', fecha: new Date() });
                actualizarIngresos();
            } catch (error) {
                console.error('Error al agregar ingreso:', error);
            }
        }
    };

    const handleAgregarEgreso = async () => {
        if (nuevoEgreso.concepto.trim() !== '' && nuevoEgreso.monto.trim() !== '') {
            try {
                await addDoc(collection(db, 'egresos'), {
                    Monto: parseFloat(nuevoEgreso.monto),
                    Concepto: nuevoEgreso.concepto,
                    Fecha: nuevoEgreso.fecha
                });
                setNuevoEgreso({ concepto: '', monto: '', fecha: new Date() });
                actualizarEgresos();
            } catch (error) {
                console.error('Error al agregar egreso:', error);
            }
        }
    };

    const actualizarIngresos = async () => {
        try {
            const snapshot = await collection(db, 'ingresos').orderBy('Fecha', 'desc').get();
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIngresos(data);
        } catch (error) {
            console.error('Error al obtener ingresos:', error);
        }
    };

    // const actualizarEgresos = async () => {
    //     try {
    //         const snapshot = await collection(db, 'egresos').orderBy('Fecha', 'desc').get();
    //         const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //         setEgresos(data);
    //     } catch (error) {
    //         console.error('Error al obtener egresos:', error);
    //     }
    // };

    return (
        <div className="tabla-container">
            <div className="tabla-ingresos">
                <h2>Ingresos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingresos.map(ingreso => (
                            <tr key={ingreso.id}>
                                <td>{ingreso.Concepto}</td>
                                <td>{ingreso.Monto}</td>
                                <td>{ingreso.Fecha.toDate().toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className="tabla-egresos">
                <h2>Egresos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {egresos.map(egreso => (
                            <tr key={egreso.id}>
                                <td>{egreso.Concepto}</td>
                                <td>{egreso.Monto}</td>
                                <td>{egreso.Fecha.toDate().toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
   <div className='container'>
    <div className='form-ingresos'>
        <h2>Agregar Ingreso</h2>
        <input type="text" value={nuevoIngreso.concepto} onChange={e => setNuevoIngreso({ ...nuevoIngreso, concepto: e.target.value })} placeholder="Concepto" />
        <input type="text" value={nuevoIngreso.monto} onChange={e => setNuevoIngreso({ ...nuevoIngreso, monto: e.target.value })} placeholder="Monto" />
        <input type="date" value={nuevoIngreso.fecha.toISOString().substr(0, 10)} onChange={e => setNuevoIngreso({ ...nuevoIngreso, fecha: new Date(e.target.value) })} />
        <button onClick={handleAgregarIngreso}>Agregar Ingreso</button>
    </div>
    <div className='form-egresos'>
        <h2>Agregar Egreso</h2>
        <input type="text" value={nuevoEgreso.concepto} onChange={e => setNuevoEgreso({ ...nuevoEgreso, concepto: e.target.value })} placeholder="Concepto" />
        <input type="text" value={nuevoEgreso.monto} onChange={e => setNuevoEgreso({ ...nuevoEgreso, monto: e.target.value })} placeholder="Monto" />
        <input type="date" value={nuevoEgreso.fecha.toISOString().substr(0, 10)} onChange={e => setNuevoEgreso({ ...nuevoEgreso, fecha: new Date(e.target.value) })} />
        <button onClick={handleAgregarEgreso}>Agregar Egreso</button>
    </div>
</div>


        </div>
    );
};

export default IngresoEgreso;
