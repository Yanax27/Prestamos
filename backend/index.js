require("dotenv").config();
const server = require("./src/app");
const { conn } = require("./src/db");
const resError = require("./src/utils/resError");

const PORT = process.env.PORT || 3001;

server.use("/", (req, res) => {
  // Puedes servir archivos estáticos aquí si es necesario
  // res.status(200).sendFile(path.join(__dirname, "./src/html/index.html"));
});

server.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  resError(res, statusCode, message);
});

conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT", PORT);
  });
});
