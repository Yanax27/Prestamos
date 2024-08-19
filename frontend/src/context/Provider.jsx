import React, { createContext, useEffect, useState } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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

  const evaluateAuth = async () => {
    const token = Cookies.get("jwt");
    if (token) {
      setIsLoggedIn(true);
      setValidToken(true);
      // Aquí puedes agregar lógica para obtener los datos del usuario, si es necesario
    } else {
      setIsLoggedIn(false);
      setValidToken(false);
    }
  };
  
  /*const evaluateAuth = async () =>{ 
    const response = await localStorage.getItem(config.localStorage);
    if(response){
      const dataConvert = JSON.parse(response);
      setDataAuth(dataConvert);
      setIsLoggedIn(true);
      setValidToken(true);
    }
  };*/
  const outhSession = () => {
    Cookies.remove("jwt");
    setValidToken(false);
    setIsLoggedIn(false);
    setDataAuth(null);
  };
  /*const outhSession = async () => {
    await localStorage.removeItem(config.localStorage);
    setValidToken(false);
    setIsLoggedIn(false);
    setDataAuth([]);
  };*/
  const STATES_MODIFIC = {
    //exportaciones
    authUser, //exportamos el estado
    setDataAuth, //exportamos la funcion modificadora
    isLoggedIn,
    setIsLoggedIn,
    validToken,
    setValidToken,
    outhSession,
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
