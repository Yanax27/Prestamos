require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Construir la conexión con variables separadas
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // Deshabilita logs de SQL en consola
    native: false, // Usa pg-native si está disponible
    dialectOptions: {
      ssl: {
        require: true, // Habilita SSL
        rejectUnauthorized: false, // Permite certificados auto-firmados (necesario para Railway)
      },
    },
  }
);

// El resto de tu archivo `db.js` permanece igual
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Abono,
  Cuenta,
  Egreso,
  Ingreso,
  Prestamo,
  Prestario,
  Roles,
  Usuario,
  RolUsuario,
} = sequelize.models;

Cuenta.hasMany(Usuario);
Usuario.belongsTo(Cuenta);

Roles.belongsToMany(Usuario, { through: RolUsuario });
Usuario.belongsToMany(Roles, { through: RolUsuario });

Prestamo.belongsTo(Usuario);
Usuario.hasMany(Prestamo);

Abono.belongsTo(Prestamo, { onDelete: "CASCADE" });
Prestamo.hasMany(Abono);

Cuenta.hasMany(Ingreso, { onDelete: "CASCADE" });
Ingreso.belongsTo(Cuenta, { onDelete: "CASCADE" });

Cuenta.hasMany(Egreso, { onDelete: "CASCADE" });
Egreso.belongsTo(Cuenta, { onDelete: "CASCADE" });

Prestario.hasMany(Prestamo);
Prestamo.belongsTo(Prestario);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
