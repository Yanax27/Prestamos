import React, { createContext, useEffect, useState } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { logoutSessionToken, validTokenSession } from "../http/fetchGet";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [authUser, setAuth] = useState({ //estado global para authLogin
    user: null
  });
  const [prestamos, setPrestamos] = useState({ //ejemplo de estado global Prestamos
    prestamos: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [validToken, setValidToken] = useState(false);


  //-----------ESTADOS-------/
  const setDataAuth = (data) => { //funciones handles para cargar actualizar o eliminar estados
    setAuth({
      ...authUser,
      user: data,
    });
  };
  const evaluateAuth = async () =>{ 
    const response = await validTokenSession(); 
    if(response.data.data.userData){ 
      setDataAuth({
        ...authUser,
        user: response.data.data.userData,
      });
      setIsLoggedIn(true);
      setValidToken(true);
    } 
  };
  const logoutSession = async () => {
    const response = await logoutSessionToken();
    setValidToken(false);
    setIsLoggedIn(false);
    setDataAuth([]);
  };
  const STATES_MODIFIC = {
    //exportaciones
    authUser, //exportamos elestado
    setDataAuth, //exportamos la funcion modificadora
    isLoggedIn,
    setIsLoggedIn,
    validToken,
    setValidToken,
    logoutSession,
    evaluateAuth
  };
  useEffect(()=>{
    evaluateAuth();
  },[])
  return (
    <DataContext.Provider value={STATES_MODIFIC}>
      {children}
    </DataContext.Provider>
  );
};
