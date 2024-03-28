import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DataContextProvider } from "./context/Provider.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DataContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataContextProvider>
);
