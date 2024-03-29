import React from "react";
import SidebarDashboard from "../Paginas/SidebarDashboard";
import { Outlet, useLocation } from "react-router-dom";
import ResumenFinanciero from "../Paginas/ResumenFinanciero";
import { NavbarDashboard } from "../Paginas/NavbarDashboard";

export const Dashboard = () => {
  const location = useLocation();
  return (
    <>
      <div className="grid w-full">
        <div className="w-full">
          <NavbarDashboard></NavbarDashboard>
        </div>
        <div className="flex grow w-full">
          <div className="">
            <SidebarDashboard></SidebarDashboard>
          </div>
          {location.pathname == "/dashboard" ? (
            <div className="w-full p-2">
              <p className="text-gray-500 dark:text-gray-400">
                {location.pathname}
              </p>
              <ResumenFinanciero></ResumenFinanciero>
            </div>
          ) : (
            <div className="grow">
              <Outlet></Outlet>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 