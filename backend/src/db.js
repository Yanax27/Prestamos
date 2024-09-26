require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed6
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false
    //   }
    // },
  }
); //para poder conectarse a una base de datos con ssl
const basename = path.basename(__filename);

const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Abono,
  Cuenta,
  Egreso,
  Ingreso,
  Prestamo,
  Prestario,
  Roles,
  Usuario,
  RolUsuario
} = sequelize.models;

// Definir relaciones
Usuario.hasOne(Cuenta); // Relación 1 a 1 entre Usuario y Cuenta
Cuenta.belongsTo(Usuario); // La Cuenta pertenece a un Usuario

Roles.belongsToMany(Usuario, { through: RolUsuario }); // El Rol pertenece a un Usuario
Usuario.belongsToMany(Roles, { through: RolUsuario }); // Relación N a N entre Usuario y Rolp

Prestamo.belongsTo(Usuario); // Relación 1 a * entre Usuario y Prestamo
Usuario.hasMany(Prestamo); // Un Usuario puede tener varios Prestamos

Abono.belongsTo(Prestamo); // Relación * a 1 entre Abono y Prestamo
Prestamo.hasMany(Abono); // Un Prestamo puede tener varios Abonos

Cuenta.hasMany(Ingreso, { onDelete: 'CASCADE' }); // Relación * a 1 entre Ingreso y Cuenta
Ingreso.belongsTo(Cuenta, { onDelete: 'CASCADE' }); // Un Ingreso pertenece a una Cuenta

Cuenta.hasMany(Egreso, { onDelete: 'CASCADE' }); // Relación * a 1 entre Egreso y Cuenta
Egreso.belongsTo(Cuenta, { onDelete: 'CASCADE' }); // Un Egreso pertenece a una Cuenta

Prestario.hasMany(Prestamo); // Relación 1 a * entre Prestario y Prestamo
Prestamo.belongsTo(Prestario); // Un Prestamo pertenece a un Prestario

module.exports = {
  //para poder importar los modelos así: const { Product, User } = require('./db.js');
  ...sequelize.models,
  conn: sequelize, // para importar la conexión { conn } = require('./db.js');
};
