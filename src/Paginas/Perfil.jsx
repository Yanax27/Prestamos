import React, { useEffect, useState } from 'react';
import { auth } from '../data/FIreBase';
import { signOut } from 'firebase/auth';
import {
    FaUser
} from 'react-icons/fa'
import '../styles/Perfil.css';

const Perfil = ({ onCerrarSesion }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const usuarioActual = auth.currentUser;
    
    if (usuarioActual) {
      setUserEmail(usuarioActual.email || '');
    }
  }, []);

  const handleCerrarSesion = async () => {
    try {
      await signOut(auth);
      onCerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <div className="container">
      <div className="profileContainer">
        <FaUser size={120} color="#3498db" className="profileIcon" />
        <p className="emailText">Correo electrónico:</p>
        <p className="emailText">{userEmail}</p>
      </div>
      <button className="button" onClick={handleCerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Perfil;
