require("dotenv").config(); //aqui .env
const server = require("./src/app");
const { conn } = require("./src/db");
const resError = require("./src/utils/resError");
const { PORT } = process.env;
const path = require("path");

server.use("/", (req, res) => {
  // res.status(200).sendFile(path.join(__dirname, "./src/html/index.html"));
});
//model to update
server.use((err, req, res, next) => { //errores cacheados
  const { statusCode, message } = err;
  resError(res, statusCode, message);
});

conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("SERVER IS RUNNING IN PORT ",PORT);
  });
});
   