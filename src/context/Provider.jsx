import React, { createContext, useState } from "react";

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
  const STATES_MODIFIC = {
    //exportaciones
    authUser, //exportamos elestado
    setDataAuth, //exportamos la funcion modificadora
    isLoggedIn,
    setIsLoggedIn,
    validToken,
    setValidToken,
  };
  return (
    <DataContext.Provider value={STATES_MODIFIC}>
      {children}
    </DataContext.Provider>
  );
};
