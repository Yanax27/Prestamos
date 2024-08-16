const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Usuario", {
    id_usuario: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    apellido: {
        type:DataTypes.TEXT,
        allowNull: true,
    },
    correo:{
        type:DataTypes.TEXT,
        allowNull: true,
    },
    contraseña:{
        type:DataTypes.TEXT,
        allowNull: true,
    }
  });
};
