const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
// const fileUpload = require("express-fileupload");

const router = require("./routes/index.js");

const server = express();
server.disable("x-powered-by");

server.name = "YANARICO";

server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());

// Middleware CORS dinámico
const allowedOrigins = [
  "http://localhost:5173", // Para desarrollo local
  process.env.FRONTEND_URL, // URL del frontend en producción
];
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

server.use((req, res, next) => {
  const now = new Date();
  res.header("Server-Time", now);
  next();
});

server.use("/api/", router);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).send(message);
});

module.exports = server;
