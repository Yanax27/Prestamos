const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index.js"); // Importamos rutas

const server = express();
server.disable("x-powered-by"); // Eliminar encabezado de Express

server.name = "YANARICO"; // Nombre de la API

// Middleware básico
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());

// Configuración de CORS
const allowedOrigins = [
  "https://lustrous-yeot-409182.netlify.app", // Frontend de producción
  "http://localhost:5173", // Frontend de desarrollo local
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // Permite el uso de cookies
  })
);

// Middleware de CORS manual para manejo adicional
server.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  }
  next();
});

// Middleware para manejar solicitudes OPTIONS globalmente
server.options("*", cors());

// Rutas
server.use("/api/", router); // Prefijo para todas las rutas de la API

// Manejo de errores global
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[Error] ${message}`);
  res.status(status).json({ error: message });
});

module.exports = server;
