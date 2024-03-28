import React from "react";
import Navbar from "../Paginas/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import ResumenFinanciero from "../Paginas/ResumenFinanciero";

export const Dashboard = () => {
  const location = useLocation();
  return (
    <div>
      <Navbar></Navbar>
      {location.pathname == "/dashboard" ? (
        <ResumenFinanciero></ResumenFinanciero>
      ) : (
        <Outlet></Outlet>
      )}
    </div>
  );
};
