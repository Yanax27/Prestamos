require("dotenv").config(); // Configuración de .env
const server = require("./src/app");
const { conn } = require("./src/db");
const resError = require("./src/utils/resError");
const { PORT } = process.env;
const path = require("path");

// Ruta de healthcheck para Railway
server.get("/backend", (req, res) => {
  res.status(200).send("OK"); // Respuesta simple con código 200
});

// Ruta principal (puedes descomentar si deseas usar un archivo HTML)
server.use("/", (req, res) => {
  // res.status(200).sendFile(path.join(__dirname, "./src/html/index.html"));
});

// Manejo de errores caché
server.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  resError(res, statusCode, message);
});

// Sincronización con la base de datos y arranque del servidor
conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("SERVER IS RUNNING IN PORT ", PORT);
  });
});
