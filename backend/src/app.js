const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./routes/index.js");

const server = express();

const allowedOrigins = [
  "https://idyllic-gingersnap-c7ca82.netlify.app", // Tu dominio de producción
  "http://localhost:5173",                  // Tu dominio en desarrollo
];

server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No autorizado por CORS"));
      }
    },
    credentials: true, // Permite enviar cookies
  })
);

server.options("*", cors());

server.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

server.use("/api/", router);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).send(message);
});

module.exports = server;
