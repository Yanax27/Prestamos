const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
// const fileUpload = require("express-fileupload");

const router = require("./routes/index.js"); //importamos rutas

const server = express(); //importamos server
server.disable("x-powered-by"); //eliminar el express service

server.name = "YANARICO"; //nombre api

//http://localhost:5173
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());

// Aplicar middleware CORS antes de definir las rutas
server.use(
  cors({
    origin: "http://localhost:5173", // reemplaza esto con el origen de tu frontend
    credentials: true,
  })
);

// Middleware para manejar solicitudes OPTIONS
server.options("*", cors());

// Aplicar encabezados CORS manualmente
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With, Content-Type,Accept,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  const now = new Date();
  res.header("Server-Time", now);
  next();
});

// server.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "./assets",
//   })
// );

// Definir rutas después de aplicar el middleware CORS
server.use("/api/", router); //rutas www.yanarico.com/api/roles
//http://localhost:3001/api/
server.use((err, req, res, next) => {
  const status = err.stats || 500;
  const message = err.message || err;
  res.status(status).send(message);
});

module.exports = server;
