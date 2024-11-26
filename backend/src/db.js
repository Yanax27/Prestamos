require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Extraer variables de entorno
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Verificar que todas las variables estén definidas
if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  console.error("❌ Error: Faltan variables de entorno necesarias para la conexión a la base de datos.");
  console.error({
    DB_USER,
    DB_PASSWORD: DB_PASSWORD ? "****" : undefined, // Ocultar la contraseña en los logs
    DB_HOST,
    DB_PORT,
    DB_NAME,
  });
  process.exit(1);
}

// Configurar la conexión a la base de datos
let sequelize;
try {
  sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    {
      logging: false, // Deshabilitar logs de SQL en consola
      native: false, // Usar pg-native si está disponible
      dialectOptions: {
        ssl: {
          require: false, // Cambiar a `true` si el servidor requiere SSL
          rejectUnauthorized: false, // Permitir certificados auto-firmados
        },
      },
    }
  );

  console.log("✅ Conexión a la base de datos configurada correctamente.");
} catch (error) {
  console.error("❌ Error al configurar la conexión a la base de datos:", error);
  process.exit(1);
}

// Cargar modelos dinámicamente
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

// Normalizar nombres de modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Relacionar modelos
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
  ...sequelize.models, // Exportar modelos
  conn: sequelize, // Exportar conexión
};
