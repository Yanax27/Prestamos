import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux-toolkit/store/store"; // Asegúrate de que la ruta sea correcta
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> {/* Provee el acceso global a Redux */}
      <BrowserRouter> {/* Configuración de rutas */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
