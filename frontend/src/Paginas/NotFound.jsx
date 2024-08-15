import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600">Página no encontrada</p>
        <Link to={"/"} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Ir a inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
